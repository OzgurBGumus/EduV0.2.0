const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    schoolId: Number,
    logoId: Number,
});

module.exports = mongoose.model('schoolLogo', CitySchema);