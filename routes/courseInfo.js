const express = require('express');
const router = express.Router();

const image2base64 = require('image-to-base64');
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');   //File System - for file manipulation
const uploadController = require("../controllers/upload");
router.use(busboy());

//Models
const School = require('../models/School');
//const SchoolImage = require('../models/SchoolImage');
const SchoolCountry = require('../models/SchoolCountry');
const SchoolState = require('../models/SchoolState');
const SchoolCity = require('../models/SchoolCity');
//const SchoolLanguage = require('../models/SchoolLanguage');
//const SchoolReservation = require('../models/SchoolReservation');
//const SchoolProgram = require('../models/SchoolProgram');
const Program = require('../models/Program');
//const ProgramProgramTime = require('../models/ProgramProgramTime');
//const ProgramProgramWeek = require('../models/ProgramProgramWeek');
//const ProgramReservation = require('../models/ProgramReservation');
//const ProgramWeek = require('../models/ProgramWeek');
//const ProgramTime = require('../models/ProgramTime');
const LReservation = require('../models/LReservation');
const Country = require('../models/Country');
const CountryState = require('../models/CountryState');
const StateCity = require('../models/StateCity');
const State = require('../models/State');
const City = require('../models/City');
const Language = require('../models/Language');


//CountryState, CountryCity
router.get('/find/country', function(req,res,next){
  var q = req.query;
  if(q.countryId){
    Country.findOne({'countryId':q.countryId}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.name){
    Country.findOne({'name':q.name}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.cityId){
    /*CountryCity.find({'cityId':q.cityId}, (err,data)=>{
      res.send(data);
    });*/
  }
  else if(q.stateId){
    /*CountryState.find({'stateId':q.stateId}, (err,data)=>{
      res.send(data);
    })*/
  }
  else{
    Country.find({}, (err,data)=>{
      res.send(data);
    })
  }
});
router.get('/find/state', function(req,res,next){
  var states = [];
  var q = req.query;
  if(q.name){
    State.findOne({'name':q.name}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.stateId){
    State.findOne({'stateId':q.stateId}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.country && q.country != 'null'){
    Country.findOne({country:q.country}, (err, country)=>{
      CountryState.find({countryId:country.id}, (err, data)=>{
        stateArray = [];
        stateListFunction(data, 0, stateArray, res);
      });
    })
  }
  else{
    var states = []
    State.find({}, (err,data)=>{
      var i=0;
      var l=data.length;
      data.forEach(state => {
        CountryState.findOne({stateId:state.id}, (err,data)=>{
          Country.findOne({id:data.countryId}, (err,country)=>{
            states.push([country, state]);
            console.log(i, l);
            if(i == l-1){
              res.send(states);
            }
            else{
              i++;
            }
          });
        });
      });
    })
  }
});
router.get('/find/city', function(req,res,next){
  var q = req.query;
  if(q.name){
    City.findOne({'name':q.name}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.cityId){
    City.findOne({'cityId':q.cityId}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.state && q.state != 'null'){
    State.findOne({state:q.state}, (err, state)=>{
      StateCity.find({stateId:state.id}, (err, data)=>{
        cityArray = [];
        cityListFunction(data, 0, cityArray, res);
      });
    })
  }
  else{
    var citys = []
    City.find({}, (err,data)=>{
      var i=0;
      var l=data.length;
      data.forEach(city => {
        StateCity.findOne({cityId:city.id}, (err,data)=>{
          State.findOne({id:data.stateId}, (err,state)=>{
            CountryState.findOne({stateId:state.id}, (err,countryState)=>{
              Country.findOne({id:countryState.countryId}, (err,country)=>{
                citys.push([country, state, city]);
                if(i == l-1){
                  //console.log('send:', citys);
                  res.send(citys);
                }
                else{
                  i++;
                }
              })
            })
          });
        });
      });
    })
  }
});
router.get('/find/language', function(req,res,next){
  var q = req.query;
  if(q.name){
    Language.findOne({'name':q.name}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.languageId){
    Language.findOne({'languageId':q.languageId}, (err,data)=>{
      res.send(data);
    });
  }
  else{
    Language.find({}, (err,data)=>{
      res.send(data);
    })
  }
});
router.get('/find/image', function(req,res,next){
  var q = req.query;
  if(q.schoolId){
    /*SchoolImage.find({'schoolId':q.schoolId}, (err,data)=>{
      res.send(data);
    });*/
  }
  else if(q.name){
    /*Image.findOne({'name':q.name}, (err,data)=>{
      res.send(data);
    });*/
  }
  else if(q.imageId){
    /*Image.findOne({'imageId':q.imageId}, (err,data)=>{
      res.send(data);
    });*/
  }
  else{
    res.send({status:0});
  }
});
router.get('/find/school', function(req,res,next){
  var q = req.query;
  if(q.schoolId){
    School.findOne({'schoolId':q.schoolId}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.schoolHttp){
    School.findOne({'schoolHttp':q.schoolHttp}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.imageId){
    /*SchoolImage.find({'imageId':q.ImageId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.schoolId);
      });
      School.find({'schoolId':{$in: Ids}}, (err,data)=>{ //????????????????????????????????????????????????????????????????????????????????????
        res.send(data);
      });
    })*/
  }
  else if(q.countryId){
    /*SchoolCountry.find({'countryId':q.countryId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.schoolId);
      });
      School.find({'schoolId': {$in: Ids}}, (err,school)=>{ //????????????????????????????????????????????????????????????????????????????????????
        res.send(school);
      });
    });*/
  }
  else if(q.stateId){
    /*SchoolState.find({'stateId':q.stateId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.schoolId);
      });
      School.find({'schoolId': {$in: Ids}}, (err,school)=>{ //????????????????????????????????????????????????????????????????????????????????????
        res.send(school);
      });
    });*/
  }
  else if(q.cityId){
    /*SchoolCity.find({'cityId':q.cityId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.schoolId);
      });
      School.find({'schoolId': {$in: Ids}}, (err,school)=>{ //????????????????????????????????????????????????????????????????????????????????????
        res.send(school);
      });
    });*/
  }
  else if(q.languageId){
    /*SchoolLanguage.find({'languageId':q.languageId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.schoolId);
      });
      School.find({'schoolId': {$in: Ids}}, (err,school)=>{ //????????????????????????????????????????????????????????????????????????????????????
        res.send(school);
      });
    });*/
  }
  else if(q.reservationId){
    /*SchoolReservation.find({'reservationId':q.reservationId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.schoolId);
      });
      School.find({'schoolId': {$in: Ids}}, (err,school)=>{ //????????????????????????????????????????????????????????????????????????????????????
        res.send(school);
      });
    });*/
  }
  else if(q.name){
    School.find({'name':q.name}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.phone){
    School.find({'phone':q.phone}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.accommodation){
    School.find({'accommodation':q.accommodation}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.airport){
    School.find({'airport':q.airport}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.hInsurance){
    School.find({'hInsurance':q.hInsurance}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.accommodation && q.airport){
    School.find({'accommodation':q.accommodation, 'airport':q.airport}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.accommodation && q.hInsurance){
    School.find({'accommodation':q.accommodation, 'hInsurance':q.hInsurance}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.airport && q.hInsurance){
    School.find({'hInsurance':q.hInsurance, 'airport':q.airport}, (err,data)=>{
      res.send(data);
    });
  }
  else{
    School.find({}, (err,data)=>{
      res.send(data);
    })
  }
});
router.get('/find/program', function(req,res,next){
  var q = req.query;
  if(q.programId){
    Program.findOne({'programId':q.programId}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.name){
    Program.find({'name':q.name}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.price){
    Program.find({'price':q.price}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.discount){
    Program.find({'discount':q.discount}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.dPrice){
    Program.find({'dPrice':q.dPrice}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.schoolId){
    /*SchoolProgram.find({'schoolId':q.schoolId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.programId);
      });
      Program.find({'programId': {$in : Ids}}, (err,program)=>{ //????????????????????????????????????????????????????????????????????????????????????
        res.send(program);
      });
    });*/
  }
  else if(q.programTimeId){
    /*ProgramProgramTime.find({'programTimeId':q.programTimeId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.programId);
      });
      Program.find({'programId': {$in : Ids}}, (err,program)=>{ //????????????????????????????????????????????????????????????????????????????????????
        res.send(program);
      });
    });*/
  }
  else if(q.programWeekId){
    /*ProgramProgramWeek.find({'programWeekId':q.programWeekId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.programId);
      });
      Program.find({'programId':d{$in : Ids}}, (err,program)=>{
        res.send(program);
      });
    });*/
  }
})
router.get('/find/programTime', function(req,res,next){
  var q = req.query;
  if(q.programTimeId){
    /*ProgramTime.findOne({'programTimeId':q.programTimeId}, (err,data)=>{
      res.send(data);
    });*/
  }
  else if(q.programId){
    /*ProgramProgramTime.findOne({'programId':q.programId}, (err,data)=>{
      ProgramTime.findOne({'programTimeId':data.programTimeId}, (err, programTime)=>{
        res.send(programTime);
      })
    });*/
  }
  else if(q.name){
    /*ProgramTime.find({'name':q.name}, (err,data)=>{
      res.send(data);
    });*/
  }
  else{
    res.send({status:0});
  }
})
router.get('/find/programWeek', function(req,res,next){
  var q = req.query;
  if(q.programWeekId){
    /*ProgramWeek.findOne({'programWeekId':q.programWeekId}, (err,data)=>{
      res.send(data);
    });*/
  }
  else if(q.programId){
    /*ProgramProgramWeek.findOne({'programId':q.programId}, (err,data)=>{
      ProgramWeek.findOne({'programWeekId':data.programWeekId}, (err, programWeek)=>{
        res.send(programWeek);
      })
    });*/
  }
  else if(q.name){
    /*ProgramWeek.find({'name':q.name}, (err,data)=>{
      res.send(data);
    });*/
  }
  else{
    res.send({status:0});
  }
})
router.get('/find/reservation', function(req,res,next){
  var q = req.query;
  if(q.reservationId){
    LReservation.findOne({'reservationId':q.reservationId}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.schoolId){
    /*SchoolReservation.find({'schoolId':q.schoolId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.reservationId);
      });
      LReservation.find({'reservationId':d{$in : Ids}}, (err,reservation)=>{
        res.send(reservation);
      });
    });*/
  }
  else if(q.programId){
    /*ProgramReservation.find({'programId':q.programId}, (err,data)=>{
      var Ids = [];
      data.forEach(element => {
        Ids.push(element.reservationId);
      });
      LReservation.find({'reservationId':d{$in : Ids}}, (err,reservation)=>{
        res.send(reservation);
      });
    });*/

  }
  else if(q.name){
    LReservation.find({'name':q.name}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.surname){
    LReservation.find({'surname':q.surname}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.name && q.surname){
    LReservation.find({'name':q.name, 'surname':q.surname}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.phone){
    LReservation.find({'phone':q.phone}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.mail){
    LReservation.find({'mail':q.mail}, (err,data)=>{
      res.send(data);
    });
  }
  else{
    res.send({status:0});
  }
});

router.get('/find/user', function(req,res,next){
  var q = req.query;
  if(q.name && q.surname && q.mail && q.username){

  }
  else if(q.levelId){

  }
  else if(q.name && q.surname && q.mail && q.levelId){

  }
  else if(q.name && q.surname && q.levelId){

  }
  else if(q.mail && q.username && q.levelId){

  }
  else if(q.UserId && q.levelId){

  }
  else if(q.name && q.levelId){
    
  }
  else if(q.surname && q.levelId){
    
  }
  else if(q.mail && q.levelId){
    
  }
  else if(q.username && q.levelId){
    
  }
  else if(q.name && q.surname && q.mail){

  }
  else if(q.name && q.surname){

  }
  else if(q.mail && q.username){

  }
  else if(q.UserId){

  }
  else if(q.name){
    
  }
  else if(q.surname){
    
  }
  else if(q.mail){
    
  }
  else if(q.username){
    
  }
  else{

  }
})
router.get('/find/userLevel', function(req,res,next){
  var q=req.query;
});


//////////////////////////////////
router.put('/find/school', function(req,res,next){
  School.find({}, (err, schools)=>{
    var i = 0;
    var newId=0;
    for(i=0;i<schools.length;i++){
      if(schools[i].id>=newId){
        newId = schools[i].id+1;
      }
    }
    var airport = 0;
    var accommodation = 0;
    var hInsurance = 0;
    var discount = 0;
    if(req.query.airport){
      airport = req.query.airport;
    }
    if(req.query.accommodation){
      accommodation = req.query.accommodation;
    }
    if(req.query.hInsurance){
      hInsurance = req.query.hInsurance;
    }
    if(req.query.discount){
      discount = req.query.discount;
    }
    const school = new School({
      id:newId,
      URL:req.query.url,
      name:req.query.name,
      email:req.query.email,
      description:req.query.description,
      adress:req.query.adress,
      phone:req.query.phone,
      accommodation:accommodation,
      airport:airport,
      hInsurance:hInsurance,
      discount:discount
    });
    Country.findOne({country:req.query.country}, (err, country)=>{
      const schoolCountry = new SchoolCountry({
        schoolId: newId,
        countryId: country.id
      });
      schoolCountry.save((err,data)=>{
        if(err){
          console.log('>schoolCountry Error..');
        }
        else{
          console.log('>schoolCountry Created..');
        }
      })
    });
    State.findOne({state:req.query.state}, (err, state)=>{
      console.log(state);
      const schoolState = new SchoolState({
        schoolId: newId,
        stateId: state.id
      });
      schoolState.save((err,data)=>{
        if(err){
          console.log('>schoolState Error..');
        }
        else{
          console.log('>schoolState Created..');
        }
      })
    });
    City.findOne({city:req.query.city}, (err, city)=>{
      const schoolCity = new SchoolCity({
        schoolId: newId,
        cityId: city.id
      });
      schoolCity.save((err,data)=>{
        if(err){
          console.log('>schoolCity Error..');
        }
        else{
          console.log('>schoolCity Created..');
        }
      })
    });
    school.save((err,data)=>{
      if(err){
        console.log('>school Couldnt Created..', err);
        res.send('no');
      }
      else{
        console.log('>school Created..', data);
        res.send('yes');
      }
    })
  })
})
router.put('/find/country', function(req,res,next){
  Country.find({}, (err, countries)=>{
    var i = 0;
    var newId=0;
    for(i=0;i<countries.length;i++){
      if(countries[i].id>=newId){
        newId = countries[i].id+1;
      }
    }
    const country = new Country({
      id: newId,
      country: req.query.country
      });
    const state = new State({
      id:0,
      state: req.query.country
    });
    state.save((err,data)=>{
      if(err)
        console.log(err);
      console.log('new countrys state is created:'+data);
    });
    const countryState = new CountryState({
      countryId:newId,
      stateId:0,
    });
    countryState.save((err,data)=>{
      if(err)
        console.log(err);
      console.log('new countryState is created:'+data);
    });

    country.save((err, data)=>{
      if (err)
          console.log(err);

      res.send(data.country);
  });
  });
});
router.put('/find/state', function(req,res,next){
  State.find({}, (err, states)=>{
    var i = 0;
    var newId=0;
    for(i=0;i<states.length;i++){
      if(states[i].id>=newId){
        newId = states[i].id+1;
      }
    }
    console.log('new StateId:'+newId);
    const state = new State({
      id: newId,
      state: req.query.state,
      });
    Country.findOne({country:req.query.country}, (err, country)=>{
      const countryState = new CountryState({
        countryId: country.id,
        stateId: newId
      }); 
      countryState.save((err,data)=>{
        if(err){
          console.log(err);
        }
      });
    })
    state.save((err, data)=>{
      if (err)
          console.log(err);
    });
  });
});
router.put('/find/city', function(req,res,next){
  City.find({}, (err, citys)=>{
    var i = 0;
    var newId=0;
    for(i=0;i<citys.length;i++){
      if(citys[i].id>=newId){
        newId = citys[i].id+1;
      }
    }
    const city = new City({
      id: newId,
      city: req.query.city,
      });
    State.findOne({state:req.query.state}, (err, state)=>{
      const stateCity = new StateCity({
        stateId: state.id,
        cityId: newId
      });
      stateCity.save((err,data)=>{
        if(err){
          console.log(err);
        }
      });
    })
    city.save((err, data)=>{
      if (err)
          console.log(err);
      console.log(data);
      res.send(data);
    });
  });
});
router.put('/find/language', function(req,res,next){
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

///////////////////////////////////
router.patch('/find/country', function(req,res,next){
  Country.findOneAndUpdate({country:req.query.country}, {country:req.query.name}, function(err, doc){
    if(err){
      console.log('PATCH /find/country-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('PATCH /find/country-->findOneAndUpdate Done.');
    }
    res.send(req.query.name);
  });
});
router.patch('/find/state', function(req,res,next){
  State.findOneAndUpdate({state:req.query.state}, {state:req.query.name}, function(err, doc){
    if(err){
      console.log('PATCH /find/state-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('PATCH /find/state-->findOneAndUpdate Done.');
    }
    res.send(req.query.name);
  });
});
router.patch('/find/city', function(req,res,next){
  City.findOneAndUpdate({city:req.query.city}, {city:req.query.name}, function(err, doc){
    if(err){
      console.log('PATCH /find/city-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('PATCH /find/city-->findOneAndUpdate Done.');
    }
    res.send(req.query.name);
  });
});
router.patch('/find/language', function(req,res,next){
  Language.findOneAndUpdate({language:req.query.language}, {language:req.query.name}, function(err, doc){
    if(err){
      console.log('PATCH /find/language-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('PATCH /find/language-->findOneAndUpdate Done.');
    }
    res.send(req.query.name);
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
  School.find({'schoolId': id}, (err, school)=>{
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
    Program.find({'schoolId':courseid}, (err, data)=>{
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
    School.find({'schoolId':program[0].schoolId}, (err,  school)=>{
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
  School.find({'schoolId': schoolId}, (err, school)=>{
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
  const promise = new Promise((resolve, reject)=>{
    School.find({}, (err, schools)=>{
      var i = 0;
      for(i=0;i<schools.length;i++){
        if(schools[i].schoolId != i){
          break;
        }
      }
      if(req.query.accommodation != '1'){
        req.query.accommodationPrice = '';
      }
      if(req.query.hInsurance != '1'){
        req.query.hInsurancePrice = ''
      }
      if(req.query.airport != '1'){
        req.query.airportPrice = ''
      }
      const school = new School({
        schoolId: i,
        schoolHttp: req.query.http,
        name: req.query.name,
        description: req.query.description,
        language: req.query.language,
        country: req.query.country,
        state: req.query.state,
        city: req.query.city,
        adress: req.query.adress,
        phone: req.query.phone,
        accommodation: req.query.accommodation,
        airport: req.query.airport,
        hInsurance: req.query.hInsurance,
        accommodationPrice: req.query.accommodationPrice,
        airportPrice: req.query.airportPrice,
        hInsurancePrice: req.query.hInsurancePrice
      });
    
      school.save((err, data)=>{
        if (err)
            console.log(err);
    
        resolve('done');
      });
    });
  });
  promise.then(()=>{
    uploadController.multipleUpload(req,res);
  })
});

function stateListFunction(data, i, stateArray, res){
  console.log('new Function i=',i);
  console.log(stateArray);
  if(i == data.length){
    console.log(stateArray);
    console.log('return stateArray: ', stateArray);
    res.send(stateArray);
  }
  else{
    State.findOne({id:data[i].stateId}, (err,state)=>{
      console.log('function findOne:', state);
      stateArray.push(state);
      console.log('Loop');
      i++;
      stateListFunction(data, i, stateArray, res);
    })
  }
}
function cityListFunction(data, i, cityArray, res){
  console.log('new Function i=',i);
  console.log(cityArray);
  if(i == data.length){
    console.log(cityArray);
    console.log('return cityArray: ', cityArray);
    res.send(cityArray);
  }
  else{
    City.findOne({id:data[i].cityId}, (err,city)=>{
      console.log('function findOne:', city);
      cityArray.push(city);
      console.log('Loop');
      i++;
      cityListFunction(data, i, cityArray, res);
    })
  }
}

module.exports = router;