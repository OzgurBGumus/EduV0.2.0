const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    schoolId: Number,
    schoolHttp: String,
    name: String,
    description: String,
    language: String,
    country: String,
    state: String,
    city: String,
    adress: String,
    phone: String,
    accommodation: String,
    airport: String,
    hInsurance: String,
    accommodationPrice : String,
    airportPrice : String,
    hInsurancePrice : String,
});

module.exports = mongoose.model('tests', SchoolSchema);