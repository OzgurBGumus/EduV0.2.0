const express = require('express');
const router = express.Router();
//Models
const Book = require('../models/Course');
/// FOR NOW ADD NEW COURSE WITH THIS JS

router.get('/course/new', function(req,res,next){
    const book = new Book({
        courseId: 1,
        courseImg: '/images/homePage-Course5.png',
        name: 'School A',
        country: 'Usa',
        time: true,
        startDateYear: 2020,
        startDateMonth: 09,
        startDateDay: 01,
        Week: 4,
        Accommodation: true,
        Airport: true,
        HInsurance: true
    });

    book.save((err, data)=>{
        if (err)
            console.log(err);

        res.json(data);
    });
});

module.exports = router;