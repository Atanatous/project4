var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    nickname: String,
    score: Number,
    mode: String
});

module.exports = mongoose.model('book', bookSchema);


