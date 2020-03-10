const express = require('express');
const router = express.Router();

router.get('/', (req,res,next)=>{
    res.render('coursePage',  { title: 'CoursePage' });
});
module.exports=router;