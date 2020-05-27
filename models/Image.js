const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    id: Number,
    name: String,
});

module.exports = mongoose.model('images', ImageSchema);