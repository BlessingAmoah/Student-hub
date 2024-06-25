const express = require('express');
const { User } = require('../models');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const verifyToken = require('../middleware/auth');

require('dotenv').config();

router.get('/', async (req, res) => {
  try {
    const profile = await User.findOne({ where: { id: req.userId } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const {
    name, profilePicture, bio, phone, address, city, state, school, course, interest
  } = req.body;

  try {
    const updatedProfile = await User.update({
      name, profilePicture, bio, phone, address, city, state, school, course, interest
    }, { where: { id: req.userId }, returning: true });
    
    res.status(200).json(updatedProfile[1][0]); // Return updated profile
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

router.post('/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const profilePicturePath = req.file.path;
    await User.update({ profilePicture: profilePicturePath }, { where: { id: req.userId } });
    res.status(200).json({ profilePicture: profilePicturePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload profile picture.' });
  }
});

module.exports = router;
