const express = require('express');
const router = express.Router();

/* GET HOMEPAGE. */
router.get('/', function(req, res, next) {
  res.render('homePage', { title: 'Express' });
});

module.exports = router;
