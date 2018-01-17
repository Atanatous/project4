var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Personal Info schema
var audioSchema = new Schema({
  filename: String,
  title: String,
  artist: String,
  picture: String,
  format: String
});

// Export Mongoose model
module.exports = mongoose.model('audio', audioSchema);
