const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogoSchema = new Schema({
    id: Number,
    name: String,
});

module.exports = mongoose.model('logo', LogoSchema);