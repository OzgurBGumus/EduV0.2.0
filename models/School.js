const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    id: Number,
    URL: String,
    name: String,
    email: String,
    description: String,
    adress: String,
    phone: String,
    accommodation: String,
    airport: String,
    hInsurance: String,
    discount: String
});

module.exports = mongoose.model('schools', SchoolSchema);