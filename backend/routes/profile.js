const express = require('express');
const { User } = require('../models');
const router = express.Router();
const multer = require('multer');
const { upload } = require('../server'); 
const verifyToken = require('../middleware/auth');
const axios = require('axios')

require('dotenv').config();

router.get('/',  async (req, res) => {
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

router.put('/', verifyToken, async (req, res) => {
  const {
    name, profilePicture, bio, phone, address, city, state, school, major, interest, mentorship
  } = req.body;

  try {
    const updatedProfile = await User.update({
      name, profilePicture, bio, phone, address, city, state, school, interest, major, mentorship
    }, { where: { id: req.userId }, returning: true });

    res.status(200).json(updatedProfile[1][0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

router.post('/profile', upload.single('profilePicture'), async (req, res) => {
  console.log(upload)
  try {
    const profilePicturePath = req.file.location;
    await User.update({ profilePicture: profilePicturePath }, { where: { id: req.userId } });
    res.status(200).json({ profilePicture: profilePicturePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload profile picture.' });
  }
});

//universities list
router.get('/university', async(req, res) => {
  const url = 'http://universities.hipolabs.com/search?country=United States';
  try {
    const response = await axios.get(url)
    res.status(200).json(response.data)
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({error: 'Failed to fetch universities'})
  }
})


module.exports = router;
