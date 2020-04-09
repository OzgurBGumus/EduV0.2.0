const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StateSchema = new Schema({
    id: Number,
    countryId: Number,
    state: String,
});

module.exports = mongoose.model('states', StateSchema);