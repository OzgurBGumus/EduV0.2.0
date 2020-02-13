const express = require('express')
const router = express.Router();

router.get('/', (req,res)=>{
    res.render('coursePage',  { title: 'Course Page' });
});
module.exports=router;