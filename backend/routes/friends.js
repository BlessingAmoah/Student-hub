// Helper function to perform BFS up to a certain degree
const bfs = async (startUserId, degree) => {
  let queue = [{ userId: startUserId, depth: 0 }];
  let visited = new Set();
  let friends = new Map();

  while (queue.length > 0) {
    let { userId, depth } = queue.shift();
    if (depth > degree) break;

    if (!visited.has(userId)) {
      visited.add(userId);

      let userFriends = await Friend.findAll({ where: { userId } });
      for (let friend of userFriends) {
        if (!visited.has(friend.friendId)) {
          queue.push({ userId: friend.friendId, depth: depth + 1 });
          friends.set(friend.friendId, (friends.get(friend.friendId) || 0) + 1);
        }
      }
    }
  }

  friends.delete(startUserId); // Remove the start user from the friends list
  return friends;
};

router.get('/recommendedFriends/:userId', verifyToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Fetch current user's friends (1st degree) using BFS
    const friendDegrees = await bfs(userId, 2);

    // Calculate connectivity score
    const connectivityScore = (friendCount) => {
      const mutualFriends = friendCount.get(userId) || 0;
      const mutualFriendsOfFriends = friendCount.get(userId) || 0;

      return (
        0.2 * mutualFriends +
        0.25 * mutualFriendsOfFriends
      );
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
          [Op.notIn]: Array.from(friendDegrees.keys()).concat(userId)
        },
        [Op.or]: [
          { id: { [Op.in]: currentUserLikes } },
          { id: { [Op.in]: currentUserComments } },
          { interest: { [Op.like]: `%${currentUser.interest}%` } },
          { major: { [Op.like]: `%${currentUser.major}%` } },
          { school: { [Op.like]: `%${currentUser.school}%` } }
        ]
      },
      attributes: ['id', 'name', 'interest', 'school', 'major']
    });

    // Calculate similarity score
    const similarityScore = (user) => {
      const userLikes = posts.flatMap(post => post.Likes.filter(like => like.userId === user.id).map(like => post.id));
      const commonLikes = currentUserLikes.filter(like => userLikes.includes(like));
      const likeScore = commonLikes.length / (currentUserLikes.length + userLikes.length - commonLikes.length) || 0;

      const userComments = posts.flatMap(post => post.Comments.filter(comment => comment.userId === user.id).map(comment => post.id));
      const commonComments = currentUserComments.filter(comment => userComments.includes(comment));
      const commentScore = commonComments.length / (currentUserComments.length + userComments.length - commonComments.length) || 0;

      const interestScore = stringSimilarity.compareTwoStrings(currentUser.interest, user.interest);
      const majorScore = stringSimilarity.compareTwoStrings(currentUser.major, user.major);
      const schoolScore = stringSimilarity.compareTwoStrings(currentUser.school, user.school);

      return (
        0.1 * likeScore +
        0.1 * commentScore +
        0.1 * interestScore +
        0.1 * schoolScore +
        0.1 * majorScore
      );
    };

    // Fetch potential friends based on BFS results and similarity check
    const potentialFriendIds = new Set([...friendDegrees.keys(), ...similarityCheck.map(user => user.id)]);
    potentialFriendIds.delete(userId); // Remove the start user from the potential friends list

    const potentialFriends = await User.findAll({
      where: { id: { [Op.in]: Array.from(potentialFriendIds) } },
      attributes: ['id', 'name', 'interest', 'school', 'major']
    });

    // Sort potential friends based on the similarity scores and connectivity score
    const sortedPotentialFriends = potentialFriends.map(user => ({
      ...user.toJSON(),
      score: similarityScore(user) + connectivityScore(friendDegrees)
    })).sort((a, b) => b.score - a.score);

    // Format the recommended friends data
    const formatRecommendation = sortedPotentialFriends.map(user => ({
      id: user.id,
      name: user.name,
      interest: user.interest,
      school: user.school,
      major: user.major,
      score: user.score
    }));

    res.status(200).json(formatRecommendation);
  } catch (error) {
    console.error('Error fetching recommended friends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
