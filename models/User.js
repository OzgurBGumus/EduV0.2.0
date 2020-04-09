const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    token: String,
});

module.exports = mongoose.model('panelUsers', userSchema);