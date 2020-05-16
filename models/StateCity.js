const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StateCitySchema = new Schema({
    stateId: Number,
    cityId: Number,
});

module.exports = mongoose.model('stateCity', StateCitySchema);