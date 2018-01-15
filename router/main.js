var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var multer    = require('multer');

var audioSchema = new Schema({
  filename: String,
  mimetype: String,
  size: Number
});
var Audio = mongoose.model('audio', audioSchema);

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/audio')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });


module.exports = function(app, fs)
{
  app.get('/', function(req, res) {
    res.render('index.html');
  });

  app.get('/sample', function(req, res) {
    res.render('music-play.html');
  });

  app.get('/example', function(req, res) {
    res.render('ex.html');
  });

  app.get('/gallery', function(req, res) {
    res.render('gallery.html');
  })

  app.get('/music', function(req, res) {
    res.render('music.html');
  })

  app.post('/audio', upload.single('audio'), function(req, res) {
    var filename  = req.file.filename
    var mimetype  = req.file.mimetype;
    var size      = req.file.size;

    Audio.findOneAndUpdate(
      { "filename": filename },
      { "filename": filename, "mimetype": mimetype, "size": size},
      { upsert: true },
      (err) => { if (err) { console.error(err); res.json({ result: 0}); return; }});

    res.redirect("/music");
  });
}
