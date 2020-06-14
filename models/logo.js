const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogoSchema = new Schema({
    id: Number,
    name: String,
    type: String
});

module.exports = mongoose.model('logo', LogoSchema);