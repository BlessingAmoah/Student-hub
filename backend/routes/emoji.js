const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

require ('dotenv').config();


const EMOJI_API_URL = 'https://www.emoji.family/api/emojis';

router.get('/', async (req, res) => {
    try{
        const response = await fetch(EMOJI_API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch emojis');
        }
        const emojis = await response.json();
        const emojiList = emojis.map(emoji => emoji.emoji);
        res.json(emojiList);
    } catch (error) {
        console.error('Error fetching emojis', error);
        res.status(500).json({error: 'Failed to fetch emojis'});
    }
});

module.exports = router
