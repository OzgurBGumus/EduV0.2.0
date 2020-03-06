const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    courseId: Number,
    time: String,
    hours: Number,
    startDateYear: Number,
    startDteMonth: Number,
    startDateDay: Number,
    Price: String
});

module.exports = mongoose.model('Programs', ProgramSchema);