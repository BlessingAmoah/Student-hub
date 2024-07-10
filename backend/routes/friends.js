const express = require('express')
const router = express.Router();
const Sequelize = require('sequelize');
const { User, Friend } = require('../models');
const verifyToken = require('../middleware/auth');
const { Post, Like, Comment} = require('../models');
const { Op } = require('sequelize');
const stringSimilarity = require('string-similarity')

// Add a friend
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        // check if the userId and friendId are the same
        if (userId === friendId){
            return res.status(400).json({ error: "Sorry, you can't add yourself as a friend"});
        }
        //verify if the friendId exists in Users table
        const friendUser = await User.findByPk(friendId);
        if(!friendUser){
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
            friendName: friendUser.name
        });
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
            include: [{ model: User, as: 'FriendUser', attributes: ['id', 'name', 'major', 'school', 'interest']}]
        });
        // format the friend list
        const formatFriends = friends.map( user =>  ({
            id: user.FriendUser.id,
            name: user.friendName || user.FriendUser.name,
            school: user.FriendUser.school,
            major: user.FriendUser.major,
            interest: user.FriendUser.interest
        }));
        res.status(200).json(formatFriends);
    } catch (error){
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Internal server error'})
    }
});

// friend recommendation
router.get('/recommendedFriends/:userId', verifyToken, async (req, res) => {
    try{
        const userId = req.params.userId;

          // fetch current user's friends - 1st degree
          const friends = await Friend.findAll({ where: { userId }});
          const friendIds = friends.map(friend => friend.friendId);

          // helper function to fetch friends of  a given userId  excluding the current friends and the user
          const excludeFriends = async (userIds, excludeIds) => {
            return await Friend.findAll({
                where: {
                    userId: { [Op.in]: userIds},
                    friendId: { [Op.notIn]: excludeIds}
                }
            });
          };

          // friends of friends - 2nd degree
          const friendsOfFriends = await excludeFriends(friendIds, [...friendIds, userId]);


          // count the occurrences of each friendId for friend of friends (2nd degree)
          const countFriends = friendsOfFriends.reduce((acc, friend) => {
              acc[friend.friendId] = (acc[friend.friendId] || 0) + 1;
              return acc;
          }, {});

          // fetch friends of friends of friends 3rd degree
          const secondDegreeFriendIds = Object.keys(countFriends).map(id => parseInt(id));
          console.log('second:',secondDegreeFriendIds)
          const friendsOfFriendsOfFriends = await excludeFriends(secondDegreeFriendIds, [...friendIds, userId, ...secondDegreeFriendIds]);

          // count the occurences of each friendId for friend of friend of friends (3rd degree)
          const countFriendsOfFriends = friendsOfFriendsOfFriends.reduce((acc, friend) => {
              acc[friend.friendId] = (acc[friend.friendId] || 0) + 1;
              return acc;
          }, {})

          //connectivity score
          const connectivityScore = (user) => {
            const mutualFriends = friends.filter(friend => friend.friendId === user.id).length;
            const mutualFriendsOfFriends = friendsOfFriends.filter(friend => friend.friendId === user.id).length;
            const mutualFriendsOfFriendsOfFriends = friendsOfFriendsOfFriends.filter(friend => friend.friendId === user.id).length;

            return(
                0.2 * mutualFriends +
                0.25 * mutualFriendsOfFriends +
               0.05  * mutualFriendsOfFriendsOfFriends
            );

          }


          // fetch all post with their likes and comments
        const posts = await Post.findAll({
            include: [
                // Include the likes with user information
                { model: Like, include: [User] },
                // Include comments with user information
                { model: Comment, include: [User] }
            ],
        });
        // extract current user's likes and comments
        const currentUserLikes = posts.flatMap( post => post.Likes.filter(like => like.userId === parseInt(userId)).map(like => post.id));
        const currentUserComments = posts.flatMap(post => post.Comments.filter(comment => comment.userId === parseInt(userId)).map(comment => post.id));

        //fetch user profile to get interests, school, and major
        const currentUser = await User.findByPk(userId);

        // fecth users who interacted with the same posts ( likes or comments), interest, school, major
        const similarityCheck = await User.findAll({
            where: {
                id: {
                    // exclude the current user and friends
                    [Op.notIn]: friendIds.concat(parseInt(userId))
                },
                [Op.or]: [
                    { id: { [Op.in]: currentUserLikes }},
                    { id: { [Op.in]: currentUserComments}},
                    { interest: { [Op.like]: `%${currentUser.interest}%` } },
                    { major: { [Op.like]: `%${ currentUser.major}%`}},
                    { school: { [Op.like]: `%${ currentUser.school}%`}}
                ]
            },
            attributes: ['id', 'name', 'interest', 'school', 'major']
        });
        // calculate similarity score
        const similarityScore = (user) => {
            // likes similarity
            const userLikes = posts.flatMap(post => post.Likes.filter(like => like.userId === user.id).map(like => post.id));
            const commonLikes = currentUserLikes.filter(like => userLikes.includes(like));
            const likeScore = commonLikes.length / (currentUserLikes.length + userLikes.length - commonLikes.length) || 0;

            //comment similarity
            const userComment = posts.flatMap(post => post.Comments.filter(comment => comment.userId === user.id).map(comment => post.id));
            const commonComments = currentUserComments.filter(comment => userComment.includes(comment));
            const commentScore = commonComments.length / (currentUserComments.length + userComment.length - commonComments.length) || 0;

            // interest similarity
            const interestScore = stringSimilarity.compareTwoStrings(currentUser.interest, user.interest);

            // major similarity
            const majorScore = stringSimilarity.compareTwoStrings(currentUser.major, user.major);

            // school similarity
            const schoolScore = stringSimilarity.compareTwoStrings(currentUser.school, user.school);

            // total similarity scores
            return(
                0.1 * likeScore +
                0.1 * commentScore +
                0.1 * interestScore +
                0.1 * schoolScore +
                0.1 * majorScore
            );
        };

        // fetch Ids from the similarity check
        const similarityCheckIds = similarityCheck.map(user => user.id)
        // sum of counts for potential friends from 2nd and 3rd degree
        const friendsCount = {...countFriends, ...countFriendsOfFriends };

        // add similarity check to friendscount
        similarityCheckIds.forEach(id => {
            friendsCount[id] = (friendsCount[id] || 0) + 1;
        })

        // potential friends
        const potentialFriends = await User.findAll({
            where: {id: {[Op.in]: Object.keys(friendsCount).map(id => parseInt(id) )}},
            attributes: ['id', 'name', 'interest', 'school', 'major']
        });


        // sort potential friends based on the similarity scores and Connectivity Score
        const sortPotentialFriend = potentialFriends.map(user => ({
            ...user.toJSON(),
            score: similarityScore(user) + connectivityScore(user)
        })).sort((a, b) => b.score - a.score);

        //format the recommended friends data
        const formatRecommendation = sortPotentialFriend.map(user => ({
            id: user.id,
            name: user.name,
            interest: user.interest,
            school: user.school,
            major: user.major,
            score: user.score
        }));



        res.status(200).json(formatRecommendation);
    } catch(error) {
        console.error('Error fetching recommended friends:', error);
        res.status(500).json({ error: 'internal server error' })
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
