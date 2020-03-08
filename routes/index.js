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



router.get('/:courseHtml', function(req,res,next){
  const {courseHtml} = req.params;
  Course.find({'courseHtml' : courseHtml}, (err, courses)=>{
    if(courses.length){
      Program.find({'courseId' : courses[0].courseId}, (err, programs)=>{
        var temp1 =0;
        var temp2 =0;
        var courseTimeList = [];
        var courseNameList = [];
        var courseTimeController=0;
        var courseNameController=0;
        for(temp1=0;temp1<programs.length;temp1++){
          //TIME LIST
          for(temp2=0;temp2<courseTimeList.length;temp2++){
            if(programs[temp1].time == courseTimeList[temp2]){
              courseTimeController = 1;
            }
          }
          if(courseTimeController == 0){
            courseTimeList.push(programs[temp1].time);
            courseTimeController =0;
          }
          //NAME LIST OLMASI GEREKEN; coursePage.js icerisinde TIME girildikten sonra o Timeyi tasiyan programlari bulacak.
          //buldugu programlari dropdownda gosterecek.
          //-----
          //Baslangic tarihi Kurs teklifi sonuna kadar aktif, ondan sonrasi pasif/disable olacak.
          //Hafta Sayisi Kursun verdigi imkanlar dogrultusunda Kurs secilince doldurulacak
          //Accommodation, Airport, HealInsurance Okul bilgisinden Cekilecek.
          /*for(temp2=0;temp2<courseTimeList.length;temp2++){
            if(programs[temp1].name == courseNameList[temp2]){
              courseNameController = 1;
            }
          }
          if(courseNameController == 0){
            courseNameList.push(programs[temp1].name);
            courseNameController =0;
          }*/
        }
        res.render('coursePage', {title: "Eduvizyon || "+courses[0].name, course: courses[0], programs: programs, selectedDate: req.query.date, courseTimeList: courseTimeList,});
      })
    }
      //COURSE PAGE COULDN'T FIND.
    else{
      res.render('homePage', { title: 'Expresss', Courses: courses[0]});
    }
      
  });

});



module.exports = router;
