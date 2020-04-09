const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Course = require('../models/Course');
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
      res.json({
        status:false,
        message:'Authentication Failed.. User not found <<<<<<<<'
      });
    }
    else{
      bcrypt.compare(password, data.password).then((result)=>{
        if(!result){
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
            expiresIn:5*60//5 Minutes
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
      res.send('data is not found./');
    }
    else{
      const username = data.username;
      console.log('ppppppppppppppppppppppppppppppppppp' + username);
      res.render('panel', {title:'Inside Panel', username:username});
    }
  });
  //token = req.cookies.token;
  //res.cookie('token', token, {expires: new Date(Date.now() + 30*100000)});
  
});

  module.exports = router;