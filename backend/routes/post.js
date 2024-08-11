const express = require('express');
const router = express.Router();
const { Post, Comment, Like, User, Notification } = require('../models');
const verifyToken = require('../middleware/auth');
const { upload } = require('../server');
const { sendToClients } = require('./sse')


// Create a new post
router.post('/', verifyToken, upload.single('media'), async (req, res) => {
  const { title, content, emojiId } = req.body;
  const fileUrl = req.file ? req.file.location : null

  try {
    const post = await Post.create({ title, content, userId: req.userId, emojiId, mediaPath: fileUrl });

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
  const userId = req.userId;

  try {
    const comment = await Comment.create({ content, userId: req.userId, postId });
     // Get the name of the user who is making the request
     const user = await User.findByPk(userId);
    // notification for the post author
    const post = await Post.findByPk(postId);

    // const variable
    const message = `Hello  ${user.name} commented on your post titled "${post.title}"`

    if (post.userId !== req.userId) {
      await Notification.create({
        userId: post.userId,
        type: 'COMMENT',
        message,
        postId,
        read: false
      });

      // Send SSE notification
      sendToClients({
        type: 'COMMENT',
        payload: {
          type: 'COMMENT',
          message,
          postId
        }
      }, post.userId);
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
    const post = await Post.findByPk(postId);

    const existingLike = await Like.findOne({ where: { userId: req.userId, postId } });
     // name of the liking user
     const user = await User.findByPk(req.userId);

     const message = `Hello ${user.name} liked your post titled "${post.title}"`

     // notification for the post author
     if (post.userId !== req.userId) {
       await Notification.create({
         userId: post.userId,
         type: 'LIKE',
         message,
         postId,
         read: false
       });

       // Send SSE notification
       sendToClients({
         payload: {
           type: 'LIKE',
           message,
           postId
         }
       }, post.userId);
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

// Delete a post
router.delete('/post/:postId', verifyToken, async (req, res) => {
  try {
    const {postId} = req.params;
    const userId = req.userId;
      //check if the post already exist
      const post = await Post.findOne({
          where: { userId, id: postId }
      });
      if (!post) {
          return res.status(404).json({ error: 'Post not found'});
      }
      // delete friend from list
      await post.destroy();
      res.status(200).json({ message: 'Post removed successfully' });
  } catch (error) {
      console.error('Error removing post:', error);
      res.status(500).json({ error: 'Internal server error'})
  }
});

module.exports = router;
