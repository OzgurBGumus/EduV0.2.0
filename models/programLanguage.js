const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramLanguageSchema = new Schema({
    programId: Number,
    languageId: Number,
});

module.exports = mongoose.model('programLanguage', ProgramLanguageSchema);