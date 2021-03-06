var url = "http://143.248.36.229:8080/"

var app = new Vue({
  el: "#album-wrapper",
  data: {
    albums: [
      {
        artist: "Jonghyeon",
        title: "Lonely",
        src: 'audio/Lonely.mp3',
        isActive: true
      }
    ],
    current: "",
    duration: "",
    indexPlaying: 0,
    seen: false
  },
  methods: {
    initWaveSurf: function(self) {
      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        barWidth: 2,
        waveColor: '#3bc9db',
        progressColor: '#15aabf',
        skipLength: 15
      });
      this.indexPlaying = parseInt(window.location.href.split('/').pop());
      this.wavesurfer.load('/audio/' + this.albums[this.indexPlaying].filename);
    },
    addWaveSurfListeners: function() {
      var self = this;
      var music = self.wavesurfer;

      music.on('ready', function() {
        music.play();
        self.duration = self.secToMin(music.getDuration());
        self.seen = true;
      });

      music.on('audioprocess', function() {
        self.current = self.secToMin(music.getCurrentTime());
      });

      music.on('finish', function() {
        console.log("finish");
        console.log(self.albums)
        self.playNext();
      });
    },
    secToMin: function(sec) {
      var minute = 0;
      var second = 0;
      var time = "";

      minute = Math.floor(sec / 60);
      second = Math.floor(sec % 60);
      if (minute < 10) {
        time += "0";
      }
      time += minute + " : ";
      if (second < 10) {
        time += "0";
      }
      time += second;
      return time;
    },
    getSurfer: function() {
      return this.wavesurfer;
    },
    play: function() {
      this.wavesurfer.play();
    },
    pause: function() {
      this.wavesurfer.pause();
    },
    stop: function() {
      this.wavesurfer.stop();
    },
    skipBackward: function() {
      this.wavesurfer.skipBackward();
    },
    skipForward: function() {
      this.wavesurfer.skipForward();
    },
    playNext: function() {
      if (this.indexPlaying < this.albums.length - 1) {
        this.indexPlaying += 1;
        this.wavesurfer.load("/audio/" + this.albums[this.indexPlaying].filename);
      } else {
        this.indexPlaying = 0;
        this.wavesurfer.load("/audio/" + this.albums[0].filename);
      }
    },
    playPrev: function() {
      if (this.indexPlaying > 0) {
        this.indexPlaying -= 1;
        this.wavesurfer.load("/audio/" + this.albums[this.indexPlaying].filename);
      } else {
        this.indexPlaying = 0;
        this.wavesurfer.load("/audio/" + this.albums[0].filename);
      }
    }
  },
  mounted: function() {
    var req = new XMLHttpRequest();
    // get server data
    req.open('GET', url + "api/music", true);
    req.responseType = 'json';
    req.onload = function() {
      app.albums = req.response;
      app.albums.forEach(function (album, index) {
        album.id = index;
        if (album.picture)
          album.picture = "data:" + album.format + ";base64," + window.btoa(album.picture);
        else
          album.picture = "/image/default.png";
      });
      app.initWaveSurf();
      app.addWaveSurfListeners();
    }
    req.send(null);
  }
});
