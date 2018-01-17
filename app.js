// serverjs

// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var fs          = require('fs');
var cors        = require('cors');
var session     = require('express-session')
// [ CONFIGURE mongoose ]

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/project4');

// DEFINE MODEL
var Info = require('./models/info');
var Song = require('./models/song');
var Playlist = require('./models/playlist');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true , limited:'50mb'}));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser({limit: '50mb'}));
app.use(session({
  secret: "!@#$abcd$#@!",
  resave: false,
  saveUninitialized: true
}));


// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;

// [CONFIGURE ROUTER]
var router = require('./router/main')(app, fs);
var router2 = require('./router/index')(app, Info, Song, Playlist);



// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Listening on ip 143.248.36.229 port 8080...");
});

app.use(express.static('asset'));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
