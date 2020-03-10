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
    accommodation: String,
    airport: String,
    hInsurance: String,
    accommodationPrice : String,
    airportPrice : String,
    hInsurancePrice : String,
    discount: String,
    description: String

});

module.exports = mongoose.model('tests', CourseSchema);