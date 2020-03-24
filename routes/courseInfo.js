const express = require('express');
const router = express.Router();
//Models
const School = require('../models/Course');
const Program = require('../models/Program');
/// FOR NOW ADD NEW COURSE WITH THIS JS

router.get('/course/new', function(req,res,next){
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
        Accommodation: "yes",
        Airport: "yes",
        HInsurance: "yes"
    });

    school.save((err, data)=>{
        if (err)
            console.log(err);

        res.json(data);
    });
});

router.get('/createProgram/new', function(req,res,next){
    const program = new Program({
        courseId: 1,
        name: 'ESL',
        time: 'Morning',
        hours: '24',
        startDateYear: 2020,
        startDteMonth: 7,
        startDateDay: 1,
        finishDateYear : 2022,
        finishDateMonth : 10,
        finishDateDay : 30,
        Price: '300',
        discount: '20',
        discountedPrice: '240'
        });

    program.save((err, data)=>{
        if (err)
            console.log(err);

        res.json(data);
    });
});

router.get('/course/:schoolName', function(req, res, next){
  const {schoolName} = req.params;
  if(schoolName == 'all'){
    School.find({}, (err, data)=>{
      res.send(data);
    });
  }
  else{
    School.find({'name':schoolName}, (err, data)=>{
      res.send(data[0]);
    });
  }
})

router.get('/program/:name', function(req, res, next){
  const {name} = req.params;
  if(name == 'all'){
    Program.find({}, (err, data)=>{
      res.send(data);
    });
  }
  else{
    Program.find({'name':name}, (err, data)=>{
      res.send(data);
    });
  }
})
router.get('/programCourseId/:courseid', function(req, res, next){
  const {courseid} = req.params;
  if(courseid == 'all'){
    Program.find({}, (err, data)=>{
      res.send(data);
    });
  }
  else{
    Program.find({'courseId':courseid}, (err, data)=>{
      res.send(data);
    });
  }
})
router.get('/homepage/:language/:country/:duration/:accommodation', function(req, res, next) {
    console.log('---------->router.get(/homepage/:language/:country/:duration/:accommodation)');
    const {language, country, duration, accommodation} = req.params;
    if(country == 'All Countries'){
      if(accommodation == 'Yes'){
        if(duration == "ANY"){
          School.find({'language': language, 'accommodation': "yes"}, (err, data)=>{
            res.send(data);
          });
        }
        else{
          School.find({'language': language, 'duration': duration, 'accommodation': "yes"}, (err, data)=>{
            res.send(data);
          });
        }
      }
      else if(accommodation == 'No'){
        if(duration == "ANY"){
          School.find({'language': language, 'accommodation': "no"}, (err, data)=>{
            res.send(data);
          });
        }
        else{
          School.find({'language': language, 'duration': duration, 'accommodation': "no"}, (err, data)=>{
            res.send(data);
          });
        }
      }
      else{
        if(duration == "ANY"){
          School.find({'language': language}, (err, data)=>{
            res.send(data);
          });
        }
        else{
          School.find({'language': language, 'duration': duration}, (err, data)=>{
            res.send(data);
          });
        }
      }
    }
    else{
      if(accommodation == 'Yes'){
        if(duration == "ANY"){
          School.find({'country': country, 'language': language, 'accommodation': "yes"}, (err, data)=>{
            res.send(data);
          });
        }
        else{
          School.find({'country': country, 'language': language, 'duration': duration, 'accommodation': "yes"}, (err, data)=>{
            res.send(data);
          });
        }
      }
      else if(accommodation == 'No'){
        if(duration == "ANY"){
          School.find({'country': country, 'language': language, 'accommodation': "no"}, (err, data)=>{
            res.send(data);
          });
        }
        else{
          School.find({'country': country, 'language': language, 'duration': duration, 'accommodation': "no"}, (err, data)=>{
            res.send(data);
          });
        }
      }
      else{
        if(duration == "ANY"){
          School.find({'country': country, 'language': language}, (err, data)=>{
            res.send(data);
          });
        }
        else{
          School.find({'country': country, 'language': language, 'duration': duration}, (err, data)=>{
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
router.get('/FilterInCoursePage/:time/:program/:hours', function(req, res, next) {
  const {time, program, hours} = req.params;
  console.log('----------------------------------------------------------------------------------------'+time, program);
  Program.find({'time': time, 'name': program, 'hours': hours}, (err, data)=>{
    res.send(data);
  });
});
/*var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
router.get('/confirm/createPdf', function(req,res,next){
    //const name = req.body.name

    var documentDefinition = {
      content: [
        'First Paragraph',
        'another paragraph'
      ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data)=>{
      res.writeHead(200,
      {
        'Content-Type': 'application/pdf',
        'Content-Disposition':'attachment;filename="testt.pdf"'
      });

      const download  = Buffer.from(data.toString('utf-8'), 'base64');
      res.end(data);
    })
    res.end(pdfDoc)
});*/


module.exports = router;