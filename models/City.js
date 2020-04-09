const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    id: Number,
    stateId: Number,
    city: String,
});

module.exports = mongoose.model('citys', CitySchema);