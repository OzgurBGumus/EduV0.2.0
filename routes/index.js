const express = require('express');
const router = express.Router();

/* GET Enter Page. */
router.get('/', function(req, res, next) {
  res.render('enterPage', { title: 'Enterpage' });
});

module.exports = router;
