const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramTimeSchema = new Schema({
    programId: Number,
    timeId: Number,
});

module.exports = mongoose.model('programTime', ProgramTimeSchema);