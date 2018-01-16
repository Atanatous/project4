var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
name: String,
path: String,
artist: String,
genre: String,
album: String,
favorite: Number
});

module.exports= mongoose.model('song',songSchema);
