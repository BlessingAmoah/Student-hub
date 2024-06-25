const express = require('express');
const router = express.Router();
const { Post, Comment, Like, User } = require('../models');
const verifyToken = require('../middleware/auth');



  

// Create a new post
router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    console.log('Fetching posts...');
    const post = await Post.create({ title, content, userId: req.userId });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Comment on a post
router.post('/:postId/comment', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    console.log('Fetching posts...');
    const comment = await Comment.create({ content, userId: req.userId, postId });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Like a post
router.post('/:postId/like', verifyToken, async (req, res) => {
  const { postId } = req.params;

  try {
    console.log('Fetching posts...');
    const existingLike = await Like.findOne({ where: { userId: req.userId, postId } });

    if (existingLike) {
      await existingLike.destroy();
      res.status(200).json({ message: 'Post unliked' });
    } else {
      const like = await Like.create({ userId: req.userId, postId });
      res.status(201).json(like);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    console.log('Fetching posts...');
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'profilePicture'] },
        { model: Comment, include: [User] },
        { model: Like }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
