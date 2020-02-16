const express = require('express');
const router = express.Router();
//models
const Course = require('../models/Course');

/* GET HOMEPAGE. */
router.get('/', function(req, res, next) {
  Course.find({courseId: 1}, (err, data)=>{
    res.render('homePage', { title: 'Expresss', Courses: data });
  });
});

router.get('/search/:language/:country/:duration/:accomodation', function(req, res, next) {
  const {language, country, duration, accomodation} = req.params;
  Course.find({'country': country}, (err, data)=>{
    res.send(data);
  });
});


module.exports = router;
