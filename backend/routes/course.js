const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Course route');
});

module.exports = router;
