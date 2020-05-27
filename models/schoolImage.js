const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolImageSchema = new Schema({
    schoolId: Number,
    imageId: Number,
});

module.exports = mongoose.model('schoolImage', SchoolImageSchema);