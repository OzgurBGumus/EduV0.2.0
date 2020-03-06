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
        Accommodation: true,
        Airport: true,
        HInsurance: true
    });

    school.save((err, data)=>{
        if (err)
            console.log(err);

        res.json(data);
    });
});

router.get('/program/new', function(req,res,next){
    const program = new Program({
        courseId: 1,
        time: 'Morning',
        hours: '20',
        startDateYear: 2020,
        startDteMonth: 7,
        startDateDay: 1,
        Price: '300'
        });

    program.save((err, data)=>{
        if (err)
            console.log(err);

        res.json(data);
    });
});

module.exports = router;