const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolProgramSchema = new Schema({
    schoolId: Number,
    programId: Number,
});

module.exports = mongoose.model('schoolProgram', SchoolProgramSchema);