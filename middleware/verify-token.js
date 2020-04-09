const express = require('express');
//const  session = require('express-session');
const jwt = require('jsonwebtoken');
const  cookieParser = require('cookie-parser');

module.exports = (req,res,next) =>{
  console.log('-------------------Ver-token::::'+req.body.token);
  const token = req.session.token;
  if(token){
    jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) =>{
      if(err){
        console.log('ERROR - jwt.verify - ERROR');
        console.log(err);
        res.render('panelLogin', {title:'Panel Login'});
      }
      else{
        console.log('PANEL --->verified.')
        req.decode = decoded;
        console.log(decoded);
        next();
      }
    });
  }
  else{
    console.log('RENDER --> panelLogin')
    res.render('panelLogin', {title:'Panel Login'});
  }
};
