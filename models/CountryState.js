const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountryStateSchema = new Schema({
    countryId: Number,
    stateId: Number,
});

module.exports = mongoose.model('countryState', CountryStateSchema);