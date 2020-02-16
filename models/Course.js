const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseId: Number,
    courseImg: String,
    name: String,
    country: String,
    time: Boolean,
    startDateYear: Number,
    startDteMonth: Number,
    startDateDay: Number,
    Week: Number,
    Accommodation: Boolean,
    Airport: Boolean,
    HInsurance: Boolean,
    discount: String
});

module.exports = mongoose.model('test', CourseSchema);