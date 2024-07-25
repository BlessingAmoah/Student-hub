const express = require('express');
const router = express.Router();
const { Post, Comment, Like, User, Notification } = require('../models');
const verifyToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { sendToClients } = require('./sse')


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|html|mov|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File type not supported');
  }
});




// Create a new post
router.post('/', verifyToken, upload.single('media'), async (req, res) => {
  const { title, content, emojiId } = req.body;
  const mediaPath = req.file ? req.file.path : null;

  try {
    const post = await Post.create({ title, content, userId: req.userId, emojiId, mediaPath });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating a post:', error)
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Comment on a post
router.post('/:postId/comment', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.create({ content, userId: req.userId, postId });
     // Get the name of the user who is making the request
     const user = await User.findByPk(req.userId);
    // notification for the post author
    const post = await Post.findByPk(postId);
    if (post.userId !== req.userId) {
      await Notification.create({
        userId: post.userId,
        type: 'COMMENT',
        message: `Hello  ${user.name} commented on your post`,
        postId,
        read: false
      });

      // Send SSE notification
      sendToClients({
        payload: {
          type: 'COMMENT',
          message: `Hello ${user.name} commented on your post`,
          postId
        }
      });
    }
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Like a post
router.post('/:postId/like', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const {emojiId } = req.body;
  try {

    const existingLike = await Like.findOne({ where: { userId: req.userId, postId } });
     // name of the liking user
     const user = await User.findByPk(req.userId);

     // notification for the post author
     const post = await Post.findByPk(postId);
     if (post.userId !== req.userId) {
       await Notification.create({
         userId: post.userId,
         type: 'LIKE',
         message: `Hello ${user.name} liked your post`,
         postId,
         read: false
       });

       // Send SSE notification
       sendToClients({
         payload: {
           type: 'LIKE',
           message: `Hello ${user.name} liked your post`,
           postId
         }
       });
     }

    if (existingLike) {
      await existingLike.destroy();
      res.status(200).json({ message: 'Post unliked' });
    } else {
      const like = await Like.create({ userId: req.userId, postId, emojiId });
      res.status(201).json(like);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
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
