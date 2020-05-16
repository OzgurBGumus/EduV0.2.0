const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolCountrySchema = new Schema({
    schoolId: Number,
    countryId: Number,
});

module.exports = mongoose.model('schoolCountry', SchoolCountrySchema);