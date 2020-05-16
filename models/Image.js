const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    id: Number,
    schoolId: Number,
    name: String,
    main: Boolean
});

module.exports = mongoose.model('images', ImageSchema);