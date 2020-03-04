const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

/* GET Enter Page. */
router.get('/', function(req, res, next) {
  res.render('enterPage', { title: 'Enterpage' });
});
router.get('/homepage', function(req, res, next) {
  Course.find({courseId: 1}, (err, data)=>{
    res.render('homePage', { title: 'Expresss', Courses: data });
  });
});
router.get('/homepage/:language/:country/:duration/:accommodation', function(req, res, next) {
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


router.get('/:courseHtml', function(req,res,next){
  const {courseHtml} = req.params;
  Course.find({'courseHtml' : courseHtml}, (err, data)=>{
    console.log(data);
    if(data.length){
      res.render('coursePage', {title: "Eduvizyon || "+data[0].name, course: data[0]});
    }
      //COURSE PAGE COULDN'T FIND.
    else{
      res.render('homePage', { title: 'Expresss', Courses: data });
    }
      
  });

});

module.exports = router;
