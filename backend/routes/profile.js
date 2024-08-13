const express = require('express');
const { User } = require('../models');
const router = express.Router();
const multer = require('multer');
const r2 = require('../config/r2Config');
const verifyToken = require('../middleware/auth');
const axios = require('axios')

require('dotenv').config();

const upload = multer({ Storage: multer.memoryStorage() });
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

// Upload profile picture to Cloudflare R2
router.post('/profile', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const file = req.file;
    const fileName = `${req.userId}-${Date.now()}-${file.originalname}`; 

    // Upload to Cloudflare R2
    const params = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, 
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      
    };

    const uploadResult = await r2.upload(params).promise();

    // Save the file URL in the user's profile
    const profilePictureUrl = `https://${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${fileName}`;
    await User.update({ profilePicture: profilePictureUrl }, { where: { id: req.userId } });

    res.status(200).json({ profilePicture: profilePictureUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
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