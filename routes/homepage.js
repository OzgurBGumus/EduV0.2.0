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

router.get('/search/:language/:country/:duration/:accommodation', function(req, res, next) {
  const {language, country, duration, accommodation} = req.params;
  console.log(req.params);
  if(accommodation == 'Yes'){
    if(duration == "ANY"){
      Course.find({'country': country, 'language': language, 'accommodation': true}, (err, data)=>{
        res.send(data);
      });
    }
    else{
      Course.find({'country': country, 'language': language, 'duration': duration, 'accommodation': true}, (err, data)=>{
        res.send(data);
      });
    }
  }
  else if(accommodation == 'No'){
    if(duration == "ANY"){
      Course.find({'country': country, 'language': language, 'accommodation': false}, (err, data)=>{
        res.send(data);
      });
    }
    else{
      Course.find({'country': country, 'language': language, 'duration': duration, 'accommodation': false}, (err, data)=>{
        res.send(data);
      });
    }
  }
  else{
    if(duration == "ANY"){
      Course.find({'country': country, 'language': language}, (err, data)=>{
        res.send(data);
      });
    }
    else{
      Course.find({'country': country, 'language': language, 'duration': duration}, (err, data)=>{
        res.send(data);
      });
    }
  }

});


module.exports = router;
