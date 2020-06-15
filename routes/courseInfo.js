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
const SchoolLogo = require('../models/schoolLogo');
const SchoolImage = require('../models/schoolImage');
const SchoolProgram = require('../models/schoolProgram');
const SchoolCountry = require('../models/schoolCountry');
const SchoolState = require('../models/schoolState');
const SchoolCity = require('../models/schoolCity');
const Logo = require('../models/logo');
const Image = require('../models/Image');
//const SchoolLanguage = require('../models/SchoolLanguage');
//const SchoolReservation = require('../models/SchoolReservation')
const Program = require('../models/Program');
const ProgramLanguage = require('../models/programLanguage');
const ProgramTime = require('../models/programTime');
//const ProgramReservation = require('../models/ProgramReservation');
const LReservation = require('../models/LReservation');
const Country = require('../models/Country');
const CountryState = require('../models/CountryState');
const CountryCity = require('../models/CountryCity');
const StateCity = require('../models/StateCity');
const State = require('../models/State');
const City = require('../models/City');
const Language = require('../models/Language');
const Time = require('../models/Time');


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
  if(q.state){
    State.findOne({'state':q.state}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.stateId){
    State.findOne({'stateId':q.stateId}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.countryId && q.countryId != 'null'){
    Country.findOne({id:q.countryId}, (err, country)=>{
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
  else if(q.stateId && q.stateId != 'undefined'){
    State.findOne({id:q.stateId}, (err, state)=>{
      console.log('state = ',state)
      StateCity.find({stateId:state.id}, (err, data)=>{
        cityArray = [];
        cityListFunction(data, 0, cityArray, res);
      });
    })
  }
  else if(q.countryId && q.countryId != 'undefined'){
    Country.findOne({id:q.countryId}, (err, country)=>{
      CountryCity.find({countryId:country.id}, (err, data)=>{
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
          if(data != null){
            State.findOne({id:data.stateId}, (err,state)=>{
              CountryState.findOne({stateId:state.id}, (err,countryState)=>{
                Country.findOne({id:countryState.countryId}, (err,country)=>{
                  citys.push([country, state, city]);
                  if(i == l-1){
                    res.send(citys);
                  }
                  else{
                    i++;
                  }
                })
              })
            });
          }
          else{
            CountryCity.findOne({cityId:city.id}, (err,data)=>{
              Country.findOne({id:data.countryId}, (err,country)=>{
                citys.push([country, city]);
                  if(i == l-1){
                    res.send(citys);
                  }
                  else{
                    i++;
                  }
              });
            })
          }
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
router.get('/find/time', function(req,res,next){
  var q = req.query;
  if(q.time){
    Time.findOne({'time':q.time}, (err,data)=>{
      res.send(data);
    });
  }
  else if(q.timeId){
    Time.findOne({'id':q.timeId}, (err,data)=>{
      res.send(data);
    });
  }
  else{
    Time.find({}, (err,data)=>{
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
    School.find({'schoolId':q.schoolId}, (err,data)=>{
      var sendable = [];
      var i = 0;
      showSchools(data, sendable, i, res);
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
      schools = data;
      var sendable = [];
      var i = 0;
      showSchools(data, sendable, i, res);
    })
  }
});
function showSchools(data, sendable, i, res){
  if(i !=data.length){
    schools = data;
    var element = data[i];
    var place = {};
    var images = {};
    images.schoolImage=[];
    SchoolCountry.findOne({schoolId:element.id}, (err,data)=>{
      Country.findOne({id:data.countryId}, (err,data)=>{
        place.country = data.country;
        place.countryId = data.id;
        SchoolState.findOne({schoolId:element.id}, (err,data)=>{
          if(data != null){
            State.findOne({id:data.stateId}, (err,data)=>{
              place.state = data.state;
              place.stateId = data.id;
              SchoolCity.findOne({schoolId:element.id}, (err,data)=>{
                City.findOne({id:data.cityId}, (err,data)=>{
                  place.city = data.city;
                  place.cityId = data.id;
                  SchoolLogo.findOne({schoolId:element.id}, (err,data)=>{
                    Logo.findOne({id:data.logoId}, (err, logo)=>{
                      images.logo = logo.name;
                      images.logoId = logo.id;
                      SchoolImage.find({schoolId:element.id}, (err,data)=>{
                        idArray = [];
                        data.forEach(element => {
                          idArray.push(element.imageId);
                          if(element == data[data.length-1]){
                            Image.find({id:{$in:idArray}}, (err,data)=>{
                              images.schoolImage=data;
                              school = schools[i];
                              var obj = {school, place, images};
                              sendable.push(obj);
                              if(i==schools.length-1){
                                //console.log('===========>', sendable);
                                res.send(sendable);
                              }
                              else{
                                showSchools(schools, sendable, i+1, res);
                              }
                            })
                          }
                        });
                      })
                    })
                  })
                });
              });
            });
          }
          else{
            SchoolCity.findOne({schoolId:element.id}, (err,data)=>{
              City.findOne({id:data.cityId}, (err,data)=>{
                place.city = data.city;
                place.cityId = data.id;
                SchoolLogo.findOne({schoolId:element.id}, (err,data)=>{
                  Logo.findOne({id:data.logoId}, (err, logo)=>{
                    images.logo = logo.name;
                    images.logoId = logo.id;
                    SchoolImage.find({schoolId:element.id}, (err,data)=>{
                      idArray = [];
                      data.forEach(element => {
                        idArray.push(element.imageId);
                        if(element == data[data.length-1]){
                          Image.find({id:{$in:idArray}}, (err,data)=>{
                            images.schoolImage=data;
                            school = schools[i];
                            var obj = {school, place, images};
                            sendable.push(obj);
                            if(i==schools.length-1){
                              //console.log('===========>', sendable);
                              res.send(sendable);
                            }
                            else{
                              showSchools(schools, sendable, i+1, res);
                            }
                          })
                        }
                      });
                    })
                  })
                })
              });
            });
          }
        });
      });
    });
  }
}
router.get('/find/program', function(req,res,next){
  var q = req.query;
  if(q.programId){
    Program.findOne({'programId':q.programId}, (err,data)=>{
      res.send(data);
    });
  }
  else{
    Program.find({}, (err,data)=>{
      programs = data;
      var stats ={};
      var sendable = [];
      var i = 0;
      if(data != []){
        data.forEach(element => {
          console.log('ElementId:::::::::', element.id);
          ProgramLanguage.findOne({programId:element.id}, (err,data)=>{
            console.log('programLanguage::::::::::::::::::::::'+data);
            Language.findOne({id:data.languageId}, (err,data)=>{
              stats.language = data.language;
              stats.languageId = data.id;
              ProgramTime.findOne({programId:element.id}, (err,data)=>{
                Time.findOne({id:data.timeId}, (err,data)=>{
                  stats.time = data.time;
                  stats.timeId = data.id;
                  SchoolProgram.findOne({programId:element.id}, (err,data)=>{
                    School.findOne({id:data.schoolId}, (err,school)=>{
                      stats.school = school.name;
                      stats.schoolId = school.id;
                      program = programs[i];
                      console.log(program);
                      var obj = {program, stats, school};
                      sendable.push(obj);
                      i++;
                      if(i==programs.length){
                        console.log(sendable);
                        res.send(sendable);
                      }
                    });
                  });
                });
              });
            });
          });
        });
      }
    })
  }
});
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
    console.log(req.query.url)
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
      discount:discount,
      status:true
    });
    Country.findOne({id:req.query.countryId}, (err, country)=>{
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
    if(req.query.stateId != 'none'){
      State.findOne({id:req.query.stateId}, (err, state)=>{
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
    }
    if(req.query.cityId != 'none'){
      City.findOne({id:req.query.cityId}, (err, city)=>{
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
    }
    school.save((err,data)=>{
      if(err){
        console.log('>school Couldnt Created..', err);
        res.send('no');
      }
      else{
        console.log('>school Created..', data);
        console.log('SCHOOL ID:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'+ newId);
        res.send({schoolId:newId});
      }
    })
  })
});
router.put('/find/program', function(req,res,next){
  Program.find({}, (err, programs)=>{
    var i = 0;
    var newId=0;
    for(i=0;i<programs.length;i++){
      if(programs[i].id>=newId){
        newId = programs[i].id+1;
      }
    }
    console.log("newId::::::"+newId);
    var discount = 0;
    if(req.query.discount){
      discount = req.query.discount;
    }
    console.log(req.query.start);
    console.log(req.query.end);
    var sDay ='';
    var sMonth='';
    var sYear='';
    var eDay='';
    var eMonth='';
    var eYear='';
    var Splace=0;
    var Eplace=0;
    for(i=0;i<req.query.start.length;i++){
      console.log('Splace = '+Splace);
      if(req.query.start[i] =='/'){
        Splace++;
      }
      else if(Splace == 0){
        sDay = sDay+req.query.start[i];
      }
      else if(Splace == 1){
        sMonth = sMonth+req.query.start[i];
      }
      else if(Splace == 2){
        sYear = sYear+req.query.start[i];
      }
    }
    console.log(sDay, sMonth, sYear);
    for(i=0;i<req.query.end.length;i++){
      console.log('Eplace = '+Eplace);
      if(req.query.end[i] =='/'){
        Eplace++;
      }
      else if(Eplace == 0){
        eDay = eDay+req.query.end[i];
      }
      else if(Eplace == 1){
        eMonth = eMonth+req.query.end[i];
      }
      else if(Eplace == 2){
        eYear = eYear+req.query.end[i];
      }
    }
    console.log(eDay, eMonth, eYear);
    const program = new Program({
      id:newId,
      name:req.query.name,
      hours:req.query.hours,
      weeks:req.query.weeks,
      adress:req.query.adress,
      startDateDay: sDay,
      startDateMonth: sMonth,
      startDateYear: sYear,
      endDateDay: eDay,
      endDateMonth: eMonth,
      endDateYear: eYear,
      price:req.query.price,
      discount:discount,
      description:req.query.description,
      status: true
    });
    const schoolProgram = new SchoolProgram({
      schoolId: req.query.schoolId,
      programId: newId
    });
    schoolProgram.save((err,data)=>{
      if(err){
        console.log('>schoolProgram Error..');
      }
      else{
        console.log('>schoolProgram Created..');
      }
    });
    const programLanguage = new ProgramLanguage({
      programId: newId,
      languageId: req.query.languageId
    });
    programLanguage.save((err,data)=>{
      if(err){
        console.log('>programLanguage Error..');
      }
      else{
        console.log('>programLanguage Created..');
      }
    });
    const programTime = new ProgramTime({
      programId: newId,
      timeId: req.query.timeId
    });
    programTime.save((err,data)=>{
      if(err){
        console.log('>programTime Error..');
      }
      else{
        console.log('>programTime Created..');
      }
    });
    program.save((err,data)=>{
      if(err){
        console.log('>program Couldnt Created..', err);
        res.send('no');
      }
      else{
        console.log('>program Created..', data);
        res.send('yes');
      }
    })
  })
});
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
      country: req.query.country,
      stateStatus: req.query.stateStatus
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
    Country.findOne({id:req.query.countryId}, (err, country)=>{
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
    if(req.query.stateId){
      State.findOne({id:req.query.stateId}, (err, state)=>{
        console.log('state:', state.state);
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
    }
    else if(req.query.countryId){
      Country.findOne({id:req.query.countryId}, (err, country)=>{
        console.log('country:', country.country);
        const countryCity = new CountryCity({
          countryId: country.id,
          cityId: newId
        });
        countryCity.save((err,data)=>{
          if(err){
            console.log(err);
          }
        });
      })
    }
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
    var newId=0;
    for(i=0;i<languages.length;i++){
      if(languages[i].id>=newId){
        newId = languages[i].id+1;
      }
    }
    const language = new Language({
      id: newId,
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
router.put('/find/time', function(req,res,next){
  Time.find({}, (err, times)=>{
    var i = 0;
    var newId=0;
    for(i=0;i<times.length;i++){
      if(times[i].id>=newId){
        newId = times[i].id+1;
      }
    }
    const time = new Time({
      id: newId,
      time: req.query.time,
      });

    time.save((err, data)=>{
      if (err)
          console.log(err);
      console.log(data);
      res.send(data);
  });
  });
});
router.post('/find/logo', function(req,res,next){
  SchoolLogo.findOne({schoolId:req.query.schoolId}, (err,data)=>{
    console.log('////////////find/logoSchoolLogo.findOne{schoolId:req.query.schoolId}, (err,data)', data);
    if(err){
      res.send(err);
    }
    else if(!data){
      var fstream;
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
        findNewId(Logo, (newId)=>{
          console.log("Uploading: " + filename);
          var path = require('path');
          var newName =req.query.schoolId+'_'+newId+path.extname(filename);
          console.log('Images New Name: '+newName);
          fstream = fs.createWriteStream(__dirname+'/../public/images/logos/'+ newName);
          file.pipe(fstream);
          fstream.on('close', function(){
            const logo = new Logo({
              id: newId,
              name: newName,
              type: path.extname(filename),
              });
            logo.save((err, data)=>{
              if (err){
                console.log(err);
              }
              else{
                const schoolLogo = new SchoolLogo({
                  schoolId: req.query.schoolId,
                  logoId: newId
                })
                schoolLogo.save((err,data)=>{
                  if(err){
                    console.log(err);
                  }
                  else{
                    console.log('schoolLogo Created...');
                    res.send(data);
                  }
                })
              }
            });
          })
        });
      });
    }
    else if(data){
        Logo.findOne({id:data.logoId}, (err, logo)=>{
          if(err){
            console.log(err);
          }
          else{
            const imagePath = __dirname+'/../public/images/logos/'+req.query.schoolId+'_'+logo.id+logo.type;
            fs.unlink(imagePath, function(err) {
              if (err) {
                throw err
              }
              else {
                var fstream;
                req.pipe(req.busboy);
                req.busboy.on('file', function (fieldname, file, filename) {
                  console.log("Uploading: " + filename);
                  var path = require('path');
                  var newName =req.query.schoolId+'_'+logo.id+path.extname(filename);
                  console.log('Images New Name: '+newName);
                  fstream = fs.createWriteStream(__dirname+'/../public/images/logos/'+ newName);
                  file.pipe(fstream);
                  fstream.on('close', function(){
                    Logo.findOneAndUpdate({id:logo.id}, {type:path.extname(filename)}, function(err, doc){
                      res.send({id:logo.id, schoolId:req.query.schoolId, type:path.extname(filename)});
                    })
                  })
                })
              }
            })
          }
        })
      }
   });
})
router.post('/find/image', function(req,res,next){
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
    findNewId(Image, (newId)=>{
      console.log("Uploading: " + filename);
      var path = require('path');
      var newName =req.query.schoolId+'_'+newId+path.extname(filename);
      console.log('Images New Name: '+newName);
      fstream = fs.createWriteStream(__dirname+'/../public/images/schoolImages/'+ newName);
      file.pipe(fstream);
      fstream.on('close', function(){
        const image = new Image({
          id: newId,
          name: newName,
          type: path.extname(filename)
          });
        image.save((err, data)=>{
          if (err){
            console.log(err);
          }
          else{
            const schoolImage = new SchoolImage({
              schoolId: req.query.schoolId,
              imageId: newId
            })
            schoolImage.save((err,data)=>{
              if(err){
                console.log(err);
              }
              else{
                res.send({id:newId, schoolId:req.query.schoolId, type:path.extname(filename)});
              }
            })
          }
        });
      })
    });
  });
})
///////////////////////////////////
router.patch('/find/country', function(req,res,next){
  Country.findOneAndUpdate({country:req.query.countryId}, {country:req.query.name}, function(err, doc){
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
  State.findOneAndUpdate({id:req.query.stateId}, {state:req.query.name}, function(err, doc){
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
  City.findOneAndUpdate({city:req.query.cityId}, {city:req.query.name}, function(err, doc){
    if(err){
      console.log('PATCH /find/city-->findOneAndUpdate Error:' + err);
    }
    else{
      console.log('PATCH /find/city-->findOneAndUpdate Done.');
    }
    res.send(req.query.name);
  });
});
router.patch('/find/school', function(req,res,next){
  if(req.query.status){
    var newStatus = false;
    if(req.query.status == 'true'){
      newStatus = true;
      console.log('newStatus:'+newStatus);
    }
    else if(req.query.status =='false'){
      newStatus = false;
      console.log('newStatus:'+newStatus);
    }
    else{
      Console.log('School Status Failed!!!');
      res.send('');
    }
    School.findOneAndUpdate({id:req.query.id}, {status:newStatus}, function(err, doc){
      if(err){
        console.log(err);
      }
      else{
        res.send('');
      }
    })
  }
  else if(req.query.id || req.query.id != ''){
    var airport=0;
    var hInsurance=0;
    var accommodation=0;
    var discount=0;
    if(req.query.airport){
      airport = req.query.airport;
    }
    if(req.query.hInsurance){
      hInsurance = req.query.hInsurance;
    }
    if(req.query.accommodation){
      accommodation = req.query.accommodation;
    }
    if(req.query.discount){
      discount = req.query.discount;
    }
    School.findOneAndUpdate({id:req.query.id}, {URL:req.query.url, name:req.query.name, email:req.query.email, description:req.query.description, adress:req.query.adress, phone:req.query.phone, accommodation:accommodation, airport:airport, hInsurance:hInsurance, discount:discount}, function(err,doc){
        if(err){
          console.log('PATCH /find/school-->findOneAndUpdate STATE -1- Error:' + err);
        }
        else{
          console.log('PATCH /find/School-->findOneAndUpdate STATE -1- Done.');
          if(req.query.stateId){
            Country.findOne({id:req.query.countryId}, (err,data)=>{
              if(err){
                console.log('Country Error:', err);
              }
              SchoolCountry.findOneAndUpdate({schoolId:req.query.id}, {countryId:data.id}, function(err,doc){
                if(err){
                  console.log('PATCH /find/school-->findOneAndUpdate STATE -2- Error:' + err);
                }
                else{
                  console.log('PATCH /find/School-->findOneAndUpdate STATE -2- Done.');
                  State.findOne({id:req.query.stateId}, (err,data)=>{
                    SchoolState.findOne({schoolId:req.query.id}, function(err,data1){
                      if(data1 == null){
                        const schoolState = new SchoolState({
                          schoolId:req.query.id,
                          stateId:data.id
                        });
                        schoolState.save((err, data)=>{
                          if (err){
                            console.log('PATCH /find/school-->schoolState.Save STATE -3- Error:' + err);
                          }
                          else{
                            console.log('PATCH /find/School-->schoolState.Save STATE -3- Done.');
                            City.findOne({id:req.query.cityId}, (err,data)=>{
                              console.log(data);
                              SchoolCity.findOneAndUpdate({schoolId:req.query.id}, {cityId:data.id}, function(err,doc){
                                if(err){
                                  console.log('PATCH /find/school-->findOneAndUpdate STATE -3- Error:' + err);
                                }
                                else{
                                  console.log('PATCH /find/School-->findOneAndUpdate STATE -4- Done.');
                                  res.end('');
                                }
                              })
                            })
                          }
                        });
                      }
                      else{
                        SchoolState.findOneAndUpdate({schoolId:req.query.id}, {stateId:data.id}, function(err,doc){
                          if(err){
                            console.log('PATCH /find/school-->findOneAndUpdate STATE -3- Error:' + err);
                          }
                          else{
                            console.log('PATCH /find/School-->findOneAndUpdate STATE -3- Done.');
                            City.findOne({id:req.query.cityId}, (err,data)=>{
                              console.log(data);
                              SchoolCity.findOneAndUpdate({schoolId:req.query.id}, {cityId:data.id}, function(err,doc){
                                if(err){
                                  console.log('PATCH /find/school-->findOneAndUpdate STATE -3- Error:' + err);
                                }
                                else{
                                  console.log('PATCH /find/School-->findOneAndUpdate STATE -4- Done.');
                                  res.end('');
                                }
                              })
                            })
                          }
                        })
                      }
                    })
                  })
                }
              })
            })
          }
          else{
            SchoolState.findOneAndDelete({schoolId:req.query.id}, (err,data)=>{
              if(err){
                console.log(err);
              }
              else{
                Country.findOne({id:req.query.countryId}, (err,data)=>{
                  if(err){
                    console.log('Country Error:', err);
                  }
                  SchoolCountry.findOneAndUpdate({schoolId:req.query.id}, {countryId:data.id}, function(err,doc){
                    if(err){
                      console.log('PATCH /find/school-->findOneAndUpdate STATE -2- Error:' + err);
                    }
                    else{
                      console.log('PATCH /find/School-->findOneAndUpdate STATE -2- Done.');
                      City.findOne({id:req.query.cityId}, (err,data)=>{
                        console.log(data);
                        SchoolCity.findOneAndUpdate({schoolId:req.query.id}, {cityId:data.id}, function(err,doc){
                          if(err){
                            console.log('PATCH /find/school-->findOneAndUpdate STATE -3- Error:' + err);
                          }
                          else{
                            console.log('PATCH /find/School-->findOneAndUpdate STATE -4- Done.');
                            res.end('');
                          }
                        })
                      })
                    }
                  })
                })
              }
            })
          }
        }
      })
  }
});
router.patch('/find/program', function(req,res,next){
  var q = req.query;
  if(req.query.status){
    var newStatus = false;
    if(req.query.status == 'true'){
      newStatus = true;
      console.log('newStatus:'+newStatus);
    }
    else if(req.query.status =='false'){
      newStatus = false;
      console.log('newStatus:'+newStatus);
    }
    else{
      Console.log('School Status Failed!!!');
      res.send('');
    }
    Program.findOneAndUpdate({id:req.query.id}, {status:newStatus}, function(err, doc){
      if(err){
        console.log(err);
      }
      else{
        res.send('');
      }
    })
  }
  else{
    var discount = 0;
    var sDay ='';
    var sMonth='';
    var sYear='';
    var eDay='';
    var eMonth='';
    var eYear='';
    var Splace=0;
    var Eplace=0;
    if(q.discount){
      discount = q.discount;
    }
    for(i=0;i<req.query.start.length;i++){
      console.log('Splace = '+Splace);
      if(req.query.start[i] =='/'){
        Splace++;
      }
      else if(Splace == 0){
        sDay = sDay+req.query.start[i];
      }
      else if(Splace == 1){
        sMonth = sMonth+req.query.start[i];
      }
      else if(Splace == 2){
        sYear = sYear+req.query.start[i];
      }
    }
    console.log(sDay, sMonth, sYear);
    for(i=0;i<req.query.end.length;i++){
      console.log('Eplace = '+Eplace);
      if(req.query.end[i] =='/'){
        Eplace++;
      }
      else if(Eplace == 0){
        eDay = eDay+req.query.end[i];
      }
      else if(Eplace == 1){
        eMonth = eMonth+req.query.end[i];
      }
      else if(Eplace == 2){
        eYear = eYear+req.query.end[i];
      }
    }
    console.log(eDay, eMonth, eYear);
    Program.findOneAndUpdate({id:q.id}, {name:q.name, weeks:q.weeks, hours:q.hours, price:q.price, startDateDay:sDay, startDateMonth:sMonth, startDateYear:sYear, endDateDay:eDay, endDateMonth:eMonth, eDateYear:eYear, description:q.description, discount:discount}, (err,program)=>{
      if(err){
        throw err;
      }
      else{
        console.log('Program: '+q.id+'----UPDATED');
        ProgramLanguage.findOneAndUpdate({programId:q.id}, {languageId:q.language}, (err, programlanguage)=>{
          if(err){
            throw err;
          }
          else{
            console.log('Program: '+q.id+'----Language Updated To:'+q.language);
            ProgramTime.findOneAndUpdate({programId:q.id}, {timeId:q.time}, (err,data)=>{
              if(err){
                throw err;
              }
              else{
                console.log('Program: '+q.id+'----Time Updated To:'+q.time);
                res.end('');
              }
            })
          }
        })
      }
    })
  }
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
  var id=req.query.id;
  var promise = new Promise((resolve, reject)=>{
    StateCity.find({'cityId':req.query.id}, (err, statecity)=>{
      console.log('here 0');
      console.log(statecity);
      StateCity.findOneAndDelete({'cityId':req.query.id}, (err,data)=>{
        console.log('StateCity is Deleted.');
        resolve('StateCity is Deleted.');
      })
    });
  })
  promise.then(()=>{
    City.findOneAndDelete({'id':req.query.id}, (err,data)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log('City is Deleted.');
        res.send('City is Deleted.')
      }
    })
  })
});
router.delete('/state/delete', function(req,res,next){
  var id=req.query.id;
  var promise = new Promise((resolve, reject)=>{
    StateCity.find({'stateId':req.query.id}, (err, statecity)=>{
      console.log('here 0');
      console.log(statecity);
      if(statecity.length != 0){
        statecity.forEach(statecityElement => {
          console.log('here 2');
          console.log(statecity);
          console.log(statecity.length);
          if(statecity.length != 0){
            statecity.forEach(statecityElement => {
              console.log('here 3');
              console.log(statecityElement);
              City.findOneAndDelete({'id':statecityElement.cityId}, (err,data)=>{
                if(statecityElement == statecity[statecity.length-1]){
                  console.log('Citys Deleted done.');
                  resolve('Citys Deleted done.');
                }
              })
            });
          }
          else{
            console.log('Havent any city//');
            resolve('Havent any city//')
          }
        });
      }
      else{
        console.log('Havent any city//');
        resolve('Havent any city//')
      }
    });
  })
  promise.then(()=>{
    StateCity.deleteMany({'stateId':req.query.id}, (err,data)=>{
      if(err){
        console.log(err);
      }
      console.log('StateCitys Deleted done.');
      console.log('here 5');
      CountryState.deleteMany({'stateId':req.query.id}, (err,data)=>{
        if(err){
          console.log('CountryState DeleteMany Error:', error);
        }
        else{
          console.log('CountryState is Deleted.');
          State.deleteMany({'id':req.query.id}, (err,data)=>{
            if(err){
              console.log('State DeleteMany Error:', err);
            }
            else{
              console.log('State is Deleted.');
              res.send('State is Deleted.');
            }
          })
        }
      })
    })
  })
});
router.delete('/country/delete', function(req,res,next){
  var id=req.query.id;
  var promise = new Promise((resolve, reject)=>{
    CountryState.find({'countryId':req.query.id}, (err, countrystate)=>{
      console.log('here 0');
      countrystate.forEach(countrystateElement => {
        console.log('here 1');
        console.log(countrystateElement);
        StateCity.find({'stateId':countrystateElement.stateId}, (err, statecity)=>{
          if(err){
            console.log(err);
          }
          console.log('here 2');
          console.log(statecity);
          console.log(statecity.length);
          if(statecity.length != 0){
            statecity.forEach(statecityElement => {
              console.log('here 3');
              console.log(statecityElement);
              City.findOneAndDelete({'id':statecityElement.cityId}, (err,data)=>{
                if(countrystateElement == countrystate[countrystate.length-1]){
                  console.log('Citys Deleted done.');
                  resolve('Citys Deleted done.');
                }
              })
            });
          }
          else{
            console.log('Havent any city//');
            resolve('Havent any city//')
          }
        })
      });
    });
  })
  promise.then(()=>{
    console.log('here 4');
    CountryState.find({'countryId':req.query.id}, (err, countrystate)=>{
      countrystate.forEach(countrystateElement => {
        StateCity.deleteMany({'stateId':countrystateElement.stateId}, (err,data)=>{
          if(err){
            console.log(err);
          }
          if(countrystateElement == countrystate[countrystate.length-1]){
            console.log('StateCitys Deleted done.');
            console.log('here 5');
            CountryState.find({'countryId':req.query.id}, (err, countrystate)=>{
              countrystate.forEach(countrystateElement => {
                console.log('')
                State.deleteMany({'id':countrystateElement.stateId}, (err, data)=>{
                  if(err){
                    console.log(err);
                  }
                  else{
                    if(countrystateElement == countrystate[countrystate.length-1]){
                      console.log('States Deleted done.')
                      console.log('here 6');
                      CountryState.deleteMany({'countryId':req.query.id}, (err, data)=>{
                        if(err){
                          console.log('countryState DeleteMany Error:', err);
                        }
                        else{
                          console.log('CountryStates Deleted done.')
                          console.log('here 7');
                          Country.deleteMany({'id':req.query.id}, (err,data)=>{
                            if(err){
                              console.log('countryState DeleteMany Error:', err);
                            }
                            else{
                              console.log('Country is Deleted.');
                              res.send('Country is Deleted.');
                            }
                          })
                        }
                      });
                    }
                  }
                })
              });
            });
          }
        })
      });
    });
  })
});
router.delete('/language/delete', function(req,res,next){
  var id=req.query.id;
  var promise = new Promise((resolve, reject)=>{
    //ProgramLanguage.findOneAndDelete({'cityId':req.query.id}, (err,data)=>{
      // PROGRAM WILL BE DELETED, PROGRAMLANGUAGE WILL BE DELETED IN HERE.
      //console.log('StateCity is Deleted.');
      resolve('StateCity is Deleted.');
    //})
  })
  promise.then(()=>{
    Language.findOneAndDelete({'id':req.query.id}, (err,data)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log('Language is Deleted.');
        res.send('Language is Deleted.')
      }
    })
  })
});
router.delete('/school/delete', function(req,res,next){
  var id = req.query.id;
  School.findOneAndDelete({id}, (data)=>{
    if(!data){
      console.log('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
      SchoolCity.findOneAndDelete({schoolId:id}, (data)=>{
        if(!data){
          console.log('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
          SchoolState.findOneAndDelete({schoolId:id}, (data)=>{
            if(!data){
              console.log('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
              SchoolCountry.findOneAndDelete({schoolId:id}, (data)=>{
                if(!data){
                  console.log('///////////////////////////////////////////////// DELETED::(ID)::' + req.query.id);
                  SchoolProgram.find({schoolId:id}, (err, programs)=>{
                    if(programs == []){
                      console.log('if');
                      programs.forEach(program => {
                        SchoolProgram.findOneAndDelete({programId:program.id}, (err, data)=>{
                          removeProgram(program, ()=>{
                            if(program == programs[programs.length-1]){
                              removeSchoolImages(id, ()=>{
                                removeSchoolLogo(id, ()=>{
                                  res.send({status:'1'});
                                });
                              });
                            }
                          })
                        });
                      });
                    }
                    else{
                      console.log('else');
                      removeSchoolImages(id, ()=>{
                        removeSchoolLogo(id, ()=>{
                          res.send({status:'1'});
                        });
                      });
                    }
                  })
                }
                else{
                  console.log('///////////////////////////////////////////////////////[SchoolCountry findOneAndRemove]  Data is not Found: '+ req.query.id);
                  res.send('[SchoolCountry findOneAndRemove] error');
                }
              });
            }
            else{
              console.log('///////////////////////////////////////////////////////[SchoolState findOneAndRemove]  Something went wrong: '+ req.query.id);
              res.send('[SchoolState findOneAndRemove] error');
            }
          });
        }
        else{
          console.log('///////////////////////////////////////////////////////[SchoolCity findOneAndRemove]  Something went wrong: '+ req.query.id);
          res.send('[SchoolCity findOneAndRemove] error');
        }
      });
    }
    else{
      console.log('///////////////////////////////////////////////////////[School findOneAndRemove]  Something went wrong: '+ req.query.id);
      res.send('[School findOneAndRemove] error');
    }
  });
});
router.delete('/program/delete', function(req,res,next){
  removeProgram(req.query.id, ()=>{
    res.send({status:'1'});
  })
})
router.delete('/image/delete', function(req,res,next){
  var schoolId = req.query.schoolId;
  var id = req.query.id;
  var type = req.query.type;
  var promise = new Promise((resolve, reject)=>{
    SchoolImage.findOneAndDelete({'schoolId':schoolId, 'imageId':id}, (err, schoolimage)=>{
      console.log('SchoolImage is Deleted.');
      resolve('SchoolImage is Deleted.');
    });
  })
  promise.then(()=>{
    Image.findOneAndDelete({'id':id}, (err,data)=>{
      if(err){
        console.log(err);
      }
      else{
        const imagePath = __dirname+'/../public/images/schoolImages/'+schoolId+'_'+id+type;
        fs.unlink(imagePath, function(err) {
          if (err) {
            throw err
          }
          else {
            console.log('Image is Deleted.');
            res.send('Image is Deleted.')
          }
        })
      }
    })
  })
})


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
    Program.find({'time': time}, (err, data)=>{
      res.send(data);
    });
});

router.get('/FilterInCoursePage/:time/:program', function(req, res, next) {
    const {time, program} = req.params;
    Program.find({'time': time, 'name': program}, (err, data)=>{
      res.send(data);
    });
});

router.get('/FilterInCoursePage/:time/:program/:hours', function(req, res, next) {
  const {time, program, hours} = req.params;
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
  if(i == data.length){
    res.send(stateArray);
  }
  else{
    State.findOne({id:data[i].stateId}, (err,state)=>{
      stateArray.push(state);
      i++;
      stateListFunction(data, i, stateArray, res);
    })
  }
}
function cityListFunction(data, i, cityArray, res){
  if(i == data.length){
    res.send(cityArray);
  }
  else{
    City.findOne({id:data[i].cityId}, (err,city)=>{
      cityArray.push(city);
      i++;
      cityListFunction(data, i, cityArray, res);
    })
  }
}
function findNewId(place, callback){
  place.find({}, (err, data)=>{
    var i = 0;
    var newId=0;
    for(i=0;i<data.length;i++){
      if(data[i].id>=newId){
        newId = data[i].id+1;
      }
    }
    callback(newId);
  });
}
function removeProgram(programId, callback){
  Program.findOneAndDelete({id:programId}, (err, data)=>{
    ProgramLanguage.findOneAndDelete({programId:programId}, (err, data)=>{
      ProgramTime.findOneAndDelete({programId:programId}, (err, data)=>{
        callback();
      })
    })
  })
}
function removeSchoolImages(schoolId, callback){
  SchoolImage.find({'schoolId':schoolId}, (err, schoolImages)=>{
    schoolImages.forEach(schoolImage => {
      SchoolImage.findOneAndDelete({schoolId:schoolId, imageId:schoolImage.imageId}, (err, schoolimage)=>{
        console.log('SchoolImage is Deleted.');
        Image.findOne({id:schoolImage.imageId}, (err,currentImage)=>{
          Image.findOneAndDelete({id:currentImage.id}, (err, data)=>{
            const imagePath = __dirname+'/../public/images/schoolImages/'+schoolId+'_'+currentImage.id+currentImage.type;
            fs.unlink(imagePath, function(err) {
              if (err) {
                throw err
              }
              else {
                console.log('Image is Deleted.');
                if(schoolImage == schoolImages[schoolImages.length-1]){
                  callback();
                }
              }
            })
          })
        });
        })
    });
  })
}
function removeSchoolLogo(schoolId, callback){
  SchoolLogo.find({schoolId:schoolId}, (err, schoolLogos)=>{
    schoolLogos.forEach(schoolLogo => {
      SchoolLogo.findOneAndDelete({schoolId:schoolId, logoId:schoolLogo.logoId}, (err, schoollogo)=>{
        console.log('SchoolLogo is Deleted.');
        Logo.findOne({id:schoolLogo.logoId}, (err, currentLogo)=>{
          Logo.findOneAndDelete({id:currentLogo.id}, (err, data)=>{
            const imagePath = __dirname+'/../public/images/logos/'+schoolId+'_'+currentLogo.id+currentLogo.type;
            fs.unlink(imagePath, function(err) {
              if (err) {
                throw err
              }
              else {
                console.log('Logo is Deleted.');
                if(schoolLogo == schoolLogos[schoolLogos.length-1]){
                  callback();
                }
              }
            })
          })
        })
      });
    });
  })
}
module.exports = router;
