const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Time = new Schema({
    id: Number,
    time: String,
});

module.exports = mongoose.model('time', Time);