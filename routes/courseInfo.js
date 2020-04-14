const express = require('express');
const router = express.Router();

const image2base64 = require('image-to-base64');
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');   //File System - for file manipulation
const uploadController = require("../controllers/upload");
router.use(busboy());

//Models
const School = require('../models/Course');
const Program = require('../models/Program');
const LReservation = require('../models/LReservation');
const Country = require('../models/Country');
const State = require('../models/State');
const City = require('../models/City');
const Language = require('../models/Language');



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

router.get('/country/new', function(req,res,next){
  Country.find({}, (err, countries)=>{
    var i = 0;
    for(i=0;i<countries.length;i++){
      if(countries[i].id != i){
        break;
      }
    }
    const country = new Country({
      id: i,
      country: req.query.country,
      });

    country.save((err, data)=>{
      if (err)
          console.log(err);

      res.send(data);
  });
  });
});
router.put('/add/state', function(req,res,next){
  State.find({}, (err, states)=>{
    var i = 0;
    for(i=0;i<states.length;i++){
      if(states[i].id != i){
        break;
      }
    }
    const state = new State({
      id: i,
      countryId: req.query.countryId,
      state: req.query.name,
      });

    state.save((err, data)=>{
      if (err)
          console.log(err);
      console.log(data);
      res.send(data);
  });
  });
});
router.put('/add/city', function(req,res,next){
  City.find({}, (err, citys)=>{
    var i = 0;
    for(i=0;i<citys.length;i++){
      if(citys[i].id != i){
        break;
      }
    }
    const city = new City({
      id: i,
      stateId: req.query.stateId,
      city: req.query.name,
      });

    city.save((err, data)=>{
      if (err)
          console.log(err);
      console.log(data);
      res.send(data);
  });
  });
});
router.put('/add/language', function(req,res,next){
  Language.find({}, (err, languages)=>{
    var i = 0;
    for(i=0;i<languages.length;i++){
      if(languages[i].id != i){
        break;
      }
    }
    const language = new Language({
      id: i,
      language: req.query.language,
      });

    language.save((err, data)=>{
      if (err)
          console.log(err);
      console.log(data);
      res.send(data);
  });
  });
});


router.get('/country/all', function(req,res,next){
  Country.find({}, (err,data)=>{
    res.send(data);
  });
});
router.get('/language/all', function(req,res,next){
  Language.find({}, (err,data)=>{
    res.send(data);
  });
});
router.get('/language/all', function(req,res,next){
  Language.find({}, (err,data)=>{
    res.send(data);
  });
});
router.get('/country/id', function(req,res,next){
  var id = req.query.id;
  Country.findOne({id}, (err,data)=>{
    res.send(data);
  });
});
router.get('/state/id', function(req,res,next){
  var id = req.query.id;
  State.findOne({id}, (err,data)=>{
    console.log('data::::::::::::::::::::::::::::::::::::::::::', data);
    res.send(data);
  });
});
router.get('/city/id', function(req,res,next){
  var id = req.query.id;
  City.findOne({id}, (err,data)=>{
    console.log('data::::::::::::::::::::::::::::::::::::::::::', data);
    res.send(data);
  });
});
router.get('/state/find', function(req,res,next){
  var countryId = req.query.countryId;
  State.find({countryId}, (err,data)=>{
    console.log('STATE===============================================', data);
    res.send(data);
  });
});
router.get('/city/find', function(req,res,next){
  var stateId = req.query.stateId;
  City.find({stateId}, (err,data)=>{
    console.log('CITY===============================================', data);
    res.send(data);
  });
});
router.put('/country/changeName', function(req,res,next){
  var id = req.query.id;
  var changedName = req.query.changedName;
  Country.findOneAndUpdate({id}, {country:changedName}, function(err, doc){
    if(err){
      console.log('/countr/name/id-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('/countr/name/id-->findOneAndUpdate Done.');
    }
  });
  res.send(changedName);
});
router.put('/state/changeName', function(req,res,next){
  var id = req.query.id;
  var changedName = req.query.changedName;
  State.findOneAndUpdate({id}, {state:changedName}, function(err, doc){
    if(err){
      console.log('/state/name/id-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('/state/name/id-->findOneAndUpdate Done.');
    }
  });
  res.send(changedName);
});
router.put('/city/changeName', function(req,res,next){
  var id = req.query.id;
  var changedName = req.query.changedName;
  City.findOneAndUpdate({id}, {city:changedName}, function(err, doc){
    if(err){
      console.log('/city/name/id-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('/city/name/id-->findOneAndUpdate Done.');
      console.log(id, changedName);
    }
  });
  res.send(changedName);
});
router.put('/language/changeName', function(req,res,next){
  var id = req.query.id;
  var changedName = req.query.changedName;
  Language.findOneAndUpdate({id}, {language:changedName}, function(err, doc){
    if(err){
      console.log('/language/changeName-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('/language/changeName-->findOneAndUpdate Done.');
    }
  });
  res.send(changedName);
});
router.delete('/city/delete', function(req,res,next){
  var id = req.query.id;
  City.findOneAndDelete({id}, (data)=>{
    if(!data){
      console.log('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
      res.send('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
    }
    else{
      res.send('///////////////////////////////////////////////////////  Data is not Found: '+ req.query.id);
    }
  });

});
router.delete('/state/delete', function(req,res,next){
  var id=req.query.id;
  City.deleteMany({'stateId':id} , (err, data)=>{
    if(err){
      console.log('/state/Delete ==>City.deleteMany ERROR: : :  '+err);
    }
    else{
      console.log('/state/Delete ==> City.deleteMany SUCCESS');
    }
  });
  State.findOneAndDelete({id}, (data)=>{
    if(!data){
      console.log('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
      res.send('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
    }
    else{
      res.send('///////////////////////////////////////////////////////  Data is not Found: '+ req.query.id);
    }
  });
});

router.delete('/country/delete', function(req,res,next){
  var id=req.query.id;
  State.find({'countryId':id}, (err, data)=>{
    if(err){
      res.send('/country/delete => State.find ERROR : : : : '+err);
    }
    else{
      data.forEach(element => {
        City.deleteMany({'stateId':element.id} , (err, data)=>{
          if(err){
            console.log('/city/Delete ==>City.deleteMany ERROR: : :  '+err);
          }
          else{
            console.log('/city/Delete ==> City.deleteMany SUCCESS');
          }
        });
      });
    }
  });
  State.deleteMany({'countryId':id} , (err, data)=>{
    if(err){
      console.log('/country/Delete ==>State.deleteMany ERROR: : :  '+err);
    }
    else{
      console.log('/country/Delete ==> State.deleteMany SUCCESS');
    }
  });

  Country.findOneAndDelete({id}, (data)=>{
    if(!data){
      console.log('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
      res.send('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
    }
    else{
      res.send('///////////////////////////////////////////////////////  Data is not Found: '+ req.query.id);
    }
  });
});
router.delete('/language/delete', function(req,res,next){
  var id = req.query.id;
  Language.findOneAndDelete({id}, (data)=>{
    if(!data){
      console.log('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
      res.send('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
    }
    else{
      res.send('///////////////////////////////////////////////////////  Data is not Found: '+ req.query.id);
    }
  });

});


router.get('/findSchool/id', function(req,res,next){
  var id = req.query.id;
  School.find({'courseId': id}, (err, school)=>{
    res.send(school[0]);
  })
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
});

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
  console.log('here------------------------------');
  var reservationId = req.query.reservationId;
  LReservation.find({'reservationId': reservationId}, (err, reservation)=>{
    image2base64("./public/images/logos/eduvizyon.png") // you can also to use url
    .then(
        (response) => {
            console.log(response) //cGF0aC90by9maWxlLmpwZw==
            res.send([reservation[0], response]);
        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    );
  });
});

router.post("/panel/multiple-upload", function(req, res){
  uploadController.multipleUpload(req,res);
  Country.find({}, (err, countries)=>{
    var i = 0;
    for(i=0;i<countries.length;i++){
      if(countries[i].id != i){
        break;
      }
    }
  });
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

module.exports = router;