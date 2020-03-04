const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseId: Number,
    courseHtml: String,
    courseImg: String,
    name: String,
    country: String,
    state: String,
    city: String,
    time: Boolean,
    startDateYear: Number,
    startDteMonth: Number,
    startDateDay: Number,
    duration: Number,
    Accommodation: Boolean,
    Airport: Boolean,
    HInsurance: Boolean,
    discount: String

});

module.exports = mongoose.model('test', CourseSchema);