const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
    id: Number,
    language: String,
});

module.exports = mongoose.model('languages', LanguageSchema);