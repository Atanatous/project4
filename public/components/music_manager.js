new Vue({
  el: "#album-wrapper",
  data: {
    sources: [
      {
        artist: "Jonghyeon",
        title: "Lonely",
        src: 'audio/Lonely.mp3',
        isActive: true
      }
    ],
    current: "abc",
    duration: "Loading..",
    seen: false
  },
  methods: {
    initWaveSurf: function(self) {
      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        barWidth: 1,
        waveColor: '#3bc9db',
        progressColor: '#15aabf',
        scrollParent: true,
        hideScrollbar: true
      });
      this.wavesurfer.load(this.sources[0].src)
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

      self.wavesurfer.on('finish', function() {
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
    playNext: function() {
      if (this.indexPlaying < this.sources.length - 1) {
        this.indexPlaying += 1;
        this.wavesurfer.load( this.sources[this.indexPlaying].src);
      } else {
        this.indexPlaying = 0;
        this.wavesurfer.load(this.sources[0].src);
      }
    },
    playPrev: function() {
      if (this.indexPlaying > 0) {
        this.indexPlaying -= 1;
        this.wavesurfer.load(this.sources[this.indexPlaying].src);
      } else {
        this.indexPlaying = 0;
        this.wavesurfer.load(this.sources[0].src);
      }
    }
  },
  mounted: function() {
    this.initWaveSurf(this);
    this.addWaveSurfListeners();
  }
});
