const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Course = require('../models/School');
const Program = require('../models/Program');
const User = require('../models/User');

router.get('/login', function(req,res,next){
  res.render('panelLogin', {title:'Panel Login'});
})
router.get('/login/verify', function(req, res, next) {
  const username = req.query.username;
  const password = req.query.password;
  User.findOne({
    username,
  }, (err, data)=>{
    if(err){
      throw err;
    }
    else if(!data){
      console.log('Authentication Failed.. User not found <<<<<<<<');
      res.json({
        status:false,
        message:'Authentication Failed.. User not found <<<<<<<<'
      });
    }
    else{
      bcrypt.compare(password, data.password).then((result)=>{
        if(!result){
          console.log('Authentication Failed.. Password is incorrect <<<<<<<<')
          res.json({
            status:false,
            message:'Authentication Failed.. Password is incorrect <<<<<<<<'
          });
        }
        else{
          const payload = {
            username
          };
          const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn:10*60//5 Minutes
          });
          User.findOneAndUpdate({username:username},{token:token}, function(err, doc){
            if(err){
                console.log("Something wrong when updating data!");
            }
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Done!');
          });
          req.session.token = token;
          res.send(username);
        }
      });
    }
  });
  });


  //........................IMPORTANT:this register page will be closed or inside of OWNER page.
router.get('/login/ExampleUserRegister', function (req,res,next){
  const username = 'testUsername';
  const password = 'testPassword';
  bcrypt.hash(password,10).then((hash)=>{
    const USER = new User({
      username,
      token:"",
      password:hash
    });
    const promise = USER.save();
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });
  });
});

router.get('/in', function(req,res,next){
  token=req.session.token;
  User.findOne({
    token,
  }, (err, data)=>{
    if(err){
      throw err;
    }
    else if(!data){
      console.log('!!!!!!!!!!!!!!!!something wrong:: data is not found /in->User.findOne(token)');
      res.render('panelLogin', {title:'Panel Login'});
    }
    else{
      const username = data.username;
      console.log('USER:' + username);
      res.render('metroicPanel', {title:'Inside Panel', username:username});
    }
  });
  //token = req.cookies.token;
  //res.cookie('token', token, {expires: new Date(Date.now() + 30*100000)});
  
});
router.get('/in/schools', function(req,res,next){
  res.render('metroic-schools');
});
router.get('/in/Countries', function(req,res,next){
  res.render('metroic-countries');
});
router.get('/in/Languages', function(req,res,next){
  res.render('metroic-languages');
});
router.get('/in/Programs', function(req,res,next){
  res.render('metroic-programs');
});
router.get('/in/Logout', function(req,res,next){
  req.session.token='0';
})

  module.exports = router;