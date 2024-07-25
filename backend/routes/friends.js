const express = require('express')
const router = express.Router();
const Sequelize = require('sequelize');
const { User, Friend, Notification } = require('../models');
const verifyToken = require('../middleware/auth');
const { Post, Like, Comment} = require('../models');
const { Op } = require('sequelize');
const stringSimilarity = require('string-similarity')
const { sendToClients } = require('./sse')

// Add a friend
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        // check if the userId and friendId are the same
        if (userId === friendId){
            return res.status(400).json({ error: "Sorry, you can't add yourself as a friend"});
        }
        //verify if the friendId exists in Users table
        const isUser = await User.findByPk(friendId);
        if(!isUser){
            return res.status(404).json({ error: 'friend not found'});
        }
        // check if the friend already exist
        const existingFriend = await Friend.findOne({
            where: { userId, friendId }
        });
        if (existingFriend){
            return res.status(400).json({ error: 'Friend already exist'});
        }
        // add a new friend
        const newFriend = await Friend.create({
            userId,
            friendId,
            friendName: isUser.name
        });

        // Get the name of the user who is making the request
        const user = await User.findByPk(userId);
        const userName = user.name;

        //Notification creation
        await Notification.create({
          userId: friendId,
          type: 'FRIEND_REQUEST',
          message: `Hello, ${userName} just added you as a friend.`
        })
        // send  friend request notification via SSE
        sendToClients({
          type: 'FRIEND_REQUEST',
          payload: {
            friendId,
            message: `Hello, ${userName} just added you as a friend.`
          }
        }, userId)
        res.status(201).json(newFriend);
    }
    catch(error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a friend
router.delete('/remove', verifyToken, async (req, res) => {
    try {
        const {
            userId, friendId
        } = req.body;
        //check if the friend already exist
        const friendExist = await Friend.findOne({
            where: { userId, friendId }
        });
        if (!friendExist) {
            return res.status(404).json({ error: 'Friend not found'});
        }
        // delete friend from list
        await friendExist.destroy();
        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: 'Internal server error'})
    }
});

// Get friends list
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId || userId === 'null') {
            throw new Error('Invalid userId');
        }
        const friends = await Friend.findAll({
            where: { userId },
            include: [{ model: User, as: 'FriendUser', attributes: ['id', 'name', 'major', 'school', 'interest', 'profilePicture']}]
        });
        // format the friend list
        const formatFriends = friends.map( user =>  ({
            id: user.FriendUser.id,
            name: user.friendName || user.FriendUser.name,
            school: user.FriendUser.school,
            major: user.FriendUser.major,
            interest: user.FriendUser.interest,
            profilePicture: user.profilePicture
        }));
        res.status(200).json(formatFriends);
    } catch (error){
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Internal server error'})
    }
});

// Helper function to perform BFS
const bfs = async (startUserId, degree) => {
    let queue = [{ userId: startUserId, depth: 0 }];
    let visited = new Set();
    let friends = new Map();

        while (queue.length > 0) {
          const { userId, depth } = queue.shift();
          if (!visited.has(userId)) {
            visited.add(userId);
            if (depth < degree){
              try{
            const userFriends = await Friend.findAll({ where: { userId } });
            for (const friend of userFriends) {
                if (!visited.has(friend.friendId)) {
                    queue.push({ userId: friend.friendId, depth: depth + 1 });
                    friends.set(friend.friendId, { count: (friends.get(friend.friendId)?.count || 0) + 1, degree: depth + 1 });
                  }
            }
          } catch (error) {
            console.error(`Error fetching friends for user ${userId}:`, error);
          }
        }
      }
    }
        return friends;
      };

  router.get('/recommendedFriends/:userId', verifyToken, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const degree = 3;

      // Fetch current user's friends (1st degree)
      const currentFriends = await Friend.findAll({ where: { userId }});
        const currentFriendIds = currentFriends.map(friend => friend.friendId);

     // fetch current user's friends  degrees using BFS helper function up to 3rd degree
     const friendDegrees = await bfs(userId, degree)

      // Calculate connectivity score
      const connectivityScore = (friendId) => {
        const friendData = friendDegrees.get(friendId);
        const isDirectFriend = currentFriendIds.includes(friendId) ? 1 : 0;
        const isSecondDegreeFriend = friendData && friendData.degree === 2 ? 1 : 0;
        const isThirdDegreeFriend = friendData && friendData.degree === 3 ? 1 : 0;

        const score = (
          0.25 * isDirectFriend +
          0.2 * isSecondDegreeFriend +
          0.05 * isThirdDegreeFriend
        );
        return score;
      };

      // Fetch all posts with their likes and comments
      const posts = await Post.findAll({
        include: [
          { model: Like, include: [User] },
          { model: Comment, include: [User] }
        ],
      });

      // Extract current user's likes and comments
      const currentUserLikes = posts.flatMap(post => post.Likes.filter(like => like.userId === userId).map(like => post.id));
      const currentUserComments = posts.flatMap(post => post.Comments.filter(comment => comment.userId === userId).map(comment => post.id));

      // Fetch user profile to get interests, school, and major
      const currentUser = await User.findByPk(userId);

      // Fetch users who interacted with the same posts (likes or comments), interest, school, major
      const similarityCheck = await User.findAll({
        where: {
          id: {
            [Op.notIn]: currentFriendIds.concat(userId)
          },
          [Op.or]: [
            { id: { [Op.in]: currentUserLikes } },
            { id: { [Op.in]: currentUserComments } },
            { interest: { [Op.like]: `%${currentUser.interest}%` } },
            { major: { [Op.like]: `%${currentUser.major}%` } },
            { school: { [Op.like]: `%${currentUser.school}%` } }
          ]
        },
        attributes: ['id', 'name', 'interest', 'school', 'major', 'profilePicture']
      });

      // Calculate similarity score
      const similarityScore = (user) => {
        const userLikes = posts.flatMap(post => post.Likes.filter(like => like.userId === user.id).map(like => post.id));
        const commonLikes = currentUserLikes.filter(like => userLikes.includes(like));
        const likeScore = commonLikes.length / (currentUserLikes.length - commonLikes.length) || 0;

        const userComments = posts.flatMap(post => post.Comments.filter(comment => comment.userId === user.id).map(comment => post.id));
        const commonComments = currentUserComments.filter(comment => userComments.includes(comment));
        const commentScore = commonComments.length / (currentUserComments.length - commonComments.length) || 0;

        const interestScore = stringSimilarity.compareTwoStrings(currentUser.interest, user.interest);
        const majorScore = stringSimilarity.compareTwoStrings(currentUser.major, user.major);
        const schoolScore = stringSimilarity.compareTwoStrings(currentUser.school, user.school);

        const score = (
            0.1 * likeScore +
            0.1 * commentScore +
            0.1 * interestScore +
            0.1 * schoolScore +
            0.1 * majorScore
          );

          return score;
        };

      // potential friends based on BFS results and similarity check
      const potentialFriendIds = new Set([...friendDegrees.keys(), ...similarityCheck.map(user => user.id)]);
      potentialFriendIds.delete(userId);

      const potentialFriends = await User.findAll({
        where: { id: { [Op.in]: Array.from(potentialFriendIds) } },
        attributes: ['id', 'name', 'interest', 'school', 'major']
      });

      // Sort potential friends based on the similarity scores and connectivity score
      const sortedPotentialFriends = potentialFriends.map(user => ({
        ...user.toJSON(),
        score: similarityScore(user) + connectivityScore(user.id)
      })).sort((a, b) => b.score - a.score);

      // Format the recommended friends data
      const formatRecommendation = sortedPotentialFriends.filter(user => !currentFriendIds.includes(user.id))
      .map(user => ({
        id: user.id,
        name: user.name,
        interest: user.interest,
        school: user.school,
        major: user.major,
        profilePicture: user.profilePicture,
        score: user.score
      }));

      res.status(200).json(formatRecommendation);
    } catch (error) {
      console.error('Error fetching recommended friends:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// available people not friends
router.get('/available/:userId', verifyToken, async ( req, res) => {
    try{
        const friends = await Friend.findAll({ where: { userId: req.params.userId }});
        const friendIds = friends.map(friend => friend.friendId);
        const availableFriend = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.notIn]: friendIds
                }
            }
        });

        res.json(availableFriend);
    } catch (error) {
        console.error('Error fetching available friend:', error)
        res.status(500).send('Server error')
    }
});

module.exports = router;
