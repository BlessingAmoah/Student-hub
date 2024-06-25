const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send('Mentorship route');
});

module.exports = router;
