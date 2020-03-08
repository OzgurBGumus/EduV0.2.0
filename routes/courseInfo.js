const express = require('express');
const router = express.Router();
//Models
const School = require('../models/Course');
const Program = require('../models/Program');
/// FOR NOW ADD NEW COURSE WITH THIS JS

router.post('/course/new', function(req,res,next){
    const school = new School({
        courseId: 1,
        courseImg: '/images/homePage-Course5.png',
        name: 'School A',
        country: 'Usa',
        time: true,
        startDateYear: 2020,
        startDateMonth: 09,
        startDateDay: 01,
        duration: 4,
        Accommodation: true,
        Airport: true,
        HInsurance: true
    });

    school.save((err, data)=>{
        if (err)
            console.log(err);

        res.json(data);
    });
});

router.post('/program/new', function(req,res,next){
    const program = new Program({
        courseId: 1,
        time: 'Morning',
        hours: '20',
        startDateYear: 2020,
        startDteMonth: 7,
        startDateDay: 1,
        finishDateYear : 2022,
        finishDateMonth : 10,
        finishDateDay : 30,
        Price: '300'
        });

    program.save((err, data)=>{
        if (err)
            console.log(err);

        res.json(data);
    });
});
router.get('/homepage/:language/:country/:duration/:accommodation', function(req, res, next) {
    const {language, country, duration, accommodation} = req.params;
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

router.get('/FilterInCoursePage/:time', function(req, res, next) {
    const {time} = req.params;
    console.log('----------------------------------------------------------------------------------------'+time);
    Program.find({'time': time}, (err, data)=>{
      res.send(data);
    });
});

router.get('/FilterInCoursePage/:time/:program', function(req, res, next) {
    const {time, program} = req.params;
    console.log('----------------------------------------------------------------------------------------'+time, program);
    Program.find({'time': time, 'name': program}, (err, data)=>{
      res.send(data);
      console.log(data);
    });
});


module.exports = router;