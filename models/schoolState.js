const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolStateSchema = new Schema({
    schoolId: Number,
    stateId: Number,
});

module.exports = mongoose.model('schoolState', SchoolStateSchema);