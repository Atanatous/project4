var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Personal Info schema
var audioSchema = new Schema({
  filename: String,
  title: String,
  artist: String,
  lyrics: String,
  mimetype: String,
  size: Number
});

// Export Mongoose model
module.exports = mongoose.model('audio', audioSchema);
