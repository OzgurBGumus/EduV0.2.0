const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
    id: Number,
    country: String,
});

module.exports = mongoose.model('countries', CountrySchema);