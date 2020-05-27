const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountryCitySchema = new Schema({
    countryId: Number,
    cityId: Number,
});

module.exports = mongoose.model('countryCity', CountryCitySchema);