var multer    = require('multer');
var ffmetadata = require('ffmetadata');
var Audio = require('../models/audio');
var jsmediatags = require('jsmediatags');

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
  
  app.get('/checklist', function(req, res) {
    res.render('checklist.html');
  });

  app.get('/sample/', function(req, res) {
    res.render('music-play.html');
  });

  app.get('/sample/:i', function(req, res) {
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
    var title     = "";
    var artist    = "";
    var picture   = "";

    new jsmediatags.Reader(req.file.path)
    .setTagsToRead(["title", "artist", "picture"])
    .read({
      onSuccess: function(tag) {
        title = tag.tags.title;
        artist = tag.tags.artist;
        picture = tag.tags.picture;

        if (picture) {
          console.log("hi")
          var base64String = "";
          for (var i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
          }
          Audio.findOneAndUpdate(
            { "title": title, "artist": artist },
            { "filename": filename, "title": title, "artist": artist, "picture": base64String, "format": picture.format},
            { upsert: true },
            (err) => { if (err) { console.error(err); res.json({ result: 0}); return; }});

          res.redirect("/music");
        }
        else {
          console.log("HI");
          Audio.findOneAndUpdate(
            { "title": title, "artist": artist },
            { "filename": filename, "title": title, "artist": artist, "picture": "", "format": ""},
            { upsert: true },
            (err) => { if (err) { console.error(err); res.json({ result: 0}); return; }});

          res.redirect("/music");
      }},
      onError: function(error) {
        console.log(':()', error.type, error.info);
      }
    });
  });
}
