var express     = require('express');
var app         = express();
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var fs          = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log("connected to mongod server");
});
mongoose.connect('mongodb://localhost/project4');

var port = process.env.PORT || 80;

var server  = app.listen(8080, function(){
  console.log("Listening on ip 143.248.36.229 port 8080...");
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var router  = require('./router/main')(app, fs);
