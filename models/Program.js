const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    id: Number,
    programId: Number,
    name: String,
    hours: Number,
    weeks: Number,
    startDateYear: Number,
    startDateMonth: Number,
    startDateDay: Number,
    endDateYear : Number,
    endDateMonth : Number,
    endDateDay : Number,
    price: String,
    discount: String,
    description: String,
    status: Boolean
});

module.exports = mongoose.model('Programs', ProgramSchema);