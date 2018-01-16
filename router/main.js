var multer    = require('multer');
var ffmetadata = require('ffmetadata');
var Audio = require('../models/audio');

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
    res.render('music-list.html');
  })

  app.get('/api/music', function(req, res) {
    Audio.find((err, audios) => {
      if (err) return res.status(500).send({ error: 'database failure' });
      res.json(audios);
    });
  })

  app.post('/audio', upload.single('audio'), function(req, res) {
    if (req.file == null) {
      res.send("There is no Upload File");
    }
    var filename  = req.file.filename;
    var mimetype  = req.file.mimetype;
    var size      = req.file.size;
    var title     = "";
    var artist    = "";
    var lyrics    = "";

    var metadata  = ffmetadata.read(req.file.path, function(err, data) {
      if (err) {
        console.error("Error reading metadata", err);
      } else {
        console.log(data);
        title = data.title;
        artist = data.artist;
        lyrics = data.lyrics;

        Audio.findOneAndUpdate(
          { "filename": filename, "artist": artist },
          { "filename": filename, "title": title, "mimetype": mimetype, "lyrics": lyrics, "size": size},
          { upsert: true },
          (err) => { if (err) { console.error(err); res.json({ result: 0}); return; }});
      }

      res.redirect("/music");
    });
  });
}
