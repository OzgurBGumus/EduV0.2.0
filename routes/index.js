const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Program = require('../models/Program')

/* GET Enter Page. */
router.get('/', function(req, res, next) {
  res.render('enterPage', { title: 'Enterpage' });
});
router.get('/homepage', function(req, res, next) {
  Course.find({}, (err, data)=>{
    res.render('homePage', { title: 'Expresss', Courses: data });
  });
});
router.get('/homepage/:language/:country/:duration/:accommodation', function(req, res, next) {
  const {language, country, duration, accommodation} = req.params;
  console.log(req.params);
  if(country == 'All Countries'){
    if(accommodation == 'Yes'){
      if(duration == "ANY"){
        Course.find({'language': language, 'accommodation': true}, (err, data)=>{
          res.send(data);
        });
      }
      else{
        Course.find({'language': language, 'duration': duration, 'accommodation': true}, (err, data)=>{
          res.send(data);
        });
      }
    }
    else if(accommodation == 'No'){
      if(duration == "ANY"){
        Course.find({'language': language, 'accommodation': false}, (err, data)=>{
          res.send(data);
        });
      }
      else{
        Course.find({'language': language, 'duration': duration, 'accommodation': false}, (err, data)=>{
          res.send(data);
        });
      }
    }
    else{
      if(duration == "ANY"){
        Course.find({'language': language}, (err, data)=>{
          res.send(data);
        });
      }
      else{
        Course.find({'language': language, 'duration': duration}, (err, data)=>{
          res.send(data);
        });
      }
    }
  }
  else{
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
  }

});


router.get('/:courseHtml', function(req,res,next){
  const {courseHtml} = req.params;
  console.log("--------------------"+req.query.date);
  Course.find({'courseHtml' : courseHtml}, (err, courses)=>{
    if(courses.length){
      Program.find({'courseId' : courses[0].courseId}, (err, programs)=>{
        res.render('coursePage', {title: "Eduvizyon || "+courses[0].name, course: courses[0], programs: programs, selectedDate: req.query.date});
      })
    }
      //COURSE PAGE COULDN'T FIND.
    else{
      res.render('homePage', { title: 'Expresss', Courses: courses[0]});
    }
      
  });

});

module.exports = router;
