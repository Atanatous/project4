var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema= new Schema({
	email: String,
	playlistname: String,
	songname: String
	});
module.exports= mongoose.model('playlist',playlistSchema);

