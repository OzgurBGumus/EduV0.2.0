const express = require('express');
const router = express.Router();
//Models
const School = require('../models/Course');
const Program = require('../models/Program');
const LReservation = require('../models/LReservation');
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
        programId: 555,
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
router.get('/findSchool/id', function(req,res,next){
  var id = req.query.id;
  School.find({'courseId': id}, (err, school)=>{
    res.send(school[0]);
  })
})
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
router.get('/confirm/:cName/:cTime/:cWeek', function(req,res,next){
  const {cName, cTime, cWeek} = req.params;
  var ncName = '';
  var ncTime = '';
  var ncWeek = parseInt(cWeek);
  for(var i=0;i<cName.length;i++){
    if(cName[i] !=' '){
      ncName = ncName+cName[i];
    }
  }
  for(var i=0;i<cTime.length;i++){
    if(cTime[i] !=' '){
      ncTime = ncTime+cTime[i];
    }
  }
  Program.find({'name': ncName, 'time': ncTime, 'hours': ncWeek}, (err, program)=>{
    School.find({'courseId':program[0].courseId}, (err,  school)=>{
      var data = [school[0], program[0]];
      res.send(data);
    });
  });
});

router.get('/reservation/getPdf', function(req,res,next){
  var schoolId = req.query.schoolId;
  var programId = req.query.programId;
  var accommodation = req.query.accommodation;
  var Paccommodation = '';
  var airport = req.query.airport;
  var Pairport = '';
  var hInsurance = req.query.hInsurance;
  var PhInsurance = '';
  var name = req.query.name;
  var surname = req.query.surname;
  var email = req.query.email;
  var nationality = req.query.nationality;
  var residence = req.query.residence;
  var city = req.query.city;
  var mobileNo = req.query.mobileNo;
  var communication = req.query.communication;
  var notes = req.query.notes;
  var currentDate = new Date();
  var currentMinute = currentDate.getMinutes();
  var currentHour = currentDate.getHours();
  var currentDay = currentDate.getDay();
  var currentMonth = currentDate.getMonth();
  var currentYear = currentDate.getFullYear();
  var startDay = '';
  var startMonth = '';
  var startYear = '';
  var timeTemp = 0;
  for(var i = 0;timeTemp<req.query.startDate.length;i++){
    if(req.query.startDate[i] != ' '){
      if(req.query.startDate[i] == '/'){
        timeTemp = i +1;
        break;
      }
      else{
        startDay = startDay + req.query.startDate[i];
      }
    }
  }
  for(var i = timeTemp;i<req.query.startDate.length;i++){
    if(req.query.startDate[i] == '/'){
      timeTemp = i +1;
      break;
    }
    else{
      startMonth = startMonth + req.query.startDate[i];
    }
  }
  for(var i = timeTemp;i<req.query.startDate.length;i++){
      startYear = startYear + req.query.startDate[i];
  }
  School.find({'courseId': schoolId}, (err, school)=>{
    if(accommodation == '  Yes'){
      Paccommodation = school[0].accommodationPrice;
    }
    else{
      Paccommodation='';
    }
    if(airport == '  Yes'){
      Pairport = school[0].airportPrice;
    }
    else{
      Pairport='';
    }
    if(hInsurance == '  Yes'){
      PhInsurance = school[0].hInsurancePrice;
    }
    else{
      PhInsurance='';
    }
    Program.find({'programId': programId}, (err, program)=>{
      LReservation.find({}, (err, reservations)=>{
        var forTest = false;
        for(var i=0; i<reservations.length;i++){
          if(reservations[i].reservationId != i){
            forTest = true;
            const reservation = new LReservation({
              reservationId: i,
              reservationDateMinute: currentMinute,
              reservationDateHour: currentHour,
              reservationDateDay: currentDay,
              reservationDateMonth: currentMonth,
              reservationDateYear: currentYear,
              name: name,
              surname: surname,
              email: email,
              nationality: nationality,
              residence: residence,
              city: city,
              mobileNo: mobileNo,
              communication: communication,
              notes: notes,
              schoolId: schoolId,
              programId: programId,
              startDateDay: parseInt(startDay),
              startDateMonth: parseInt(startMonth),
              startDateYear: parseInt(startYear),
              accommodation: accommodation,
              Paccommodation: Paccommodation,
              airport: airport,
              Pairport: Pairport,
              hInsurance: hInsurance,
              PhInsurance: PhInsurance,
            });
            reservation.save((err, data)=>{
              if(err)
                console.log(err);

              res.json(data);
            });
          }
        }
        if(forTest == false){
          const reservation = new LReservation({
            reservationId: reservations.length,
            reservationDateMinute: currentMinute,
            reservationDateHour: currentHour,
            reservationDateDay: currentDay,
            reservationDateMonth: currentMonth,
            reservationDateYear: currentYear,
            name: name,
            surname: surname,
            email: email,
            nationality: nationality,
            residence: residence,
            city: city,
            mobileNo: mobileNo,
            communication: communication,
            notes: notes,
            schoolId: schoolId,
            programId: programId,
            startDateDay: parseInt(startDay),
            startDateMonth: parseInt(startMonth),
            startDateYear: parseInt(startYear),
            accommodation: accommodation,
            Paccommodation: Paccommodation,
            airport: airport,
            Pairport: Pairport,
            hInsurance: hInsurance,
            PhInsurance: PhInsurance,
          });
          reservation.save((err, data)=>{
            if(err)
              console.log(err);

            res.json(data);
          });
        }
      });
    });
  });
});
router.get('/reservation/getDetails', function(req,res,next){
  var reservationId = req.query.reservationId;
  LReservation.find({'reservationId': reservationId}, (err, reservation)=>{
    res.send(reservation[0]);
  });
});
module.exports = router;