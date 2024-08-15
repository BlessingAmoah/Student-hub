const express = require('express');
const { User } = require('../models');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const verifyToken = require('../middleware/auth');
const axios = require('axios')

require('dotenv').config();

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

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

    // Upload profile picture to AWS S3
router.post('/upload', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const file = req.file;
    const fileName = `${req.userId}-${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();

    const profilePictureUrl = data.Location;

    await User.update(
      { profilePicture: profilePictureUrl },
      { where: { id: req.userId } }
    );

    res.status(200).json({ profilePictureUrl });
  } catch (error) {
    console.error('Error uploading to S3:', error);
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