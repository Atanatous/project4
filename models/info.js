var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Personal Info schema
var infoSchema = new Schema({
email:{
type: String,
unique: true,
},
name: String,
password: String
});

// Export Mongoose model
module.exports = mongoose.model('info',infoSchema);
