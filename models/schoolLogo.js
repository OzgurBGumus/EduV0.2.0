const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolLogoSchema = new Schema({
    schoolId: Number,
    logoId: Number,
});

module.exports = mongoose.model('schoolLogo', SchoolLogoSchema);