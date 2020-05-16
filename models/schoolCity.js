const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolCitySchema = new Schema({
    schoolId: Number,
    cityId: Number,
});

module.exports = mongoose.model('schoolCity', SchoolCitySchema);