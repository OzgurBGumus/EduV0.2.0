const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    courseId: Number,
    name: String,
    time: String,
    hours: Number,
    startDateYear: Number,
    startDateMonth: Number,
    startDateDay: Number,
    finishDateYear : Number,
    finishDateMonth : Number,
    finishDateDay : Number,
    price: String,
    discount: String,
    discountedPrice: String,
    description: String
});

module.exports = mongoose.model('Programs', ProgramSchema);