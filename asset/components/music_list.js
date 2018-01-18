var url = "http://143.248.36.229:8080/"
var server_url = "http://143.248.132.112:80/"

// albumApp Vue instance
var albumApp = new Vue({
  // albumApp initial state
  data: {
    albums: [],
    urls: []
  },
  methods: {
    createURL: function() {
      this.albums.forEach(function (album, index) {
        albumApp.urls.push("sample/" + index);
      });
    }
  }
});


// mount
albumApp.$mount('.albumApp');

var req = new XMLHttpRequest();
// get server data
req.open('GET', url + "api/music", true);
req.responseType = 'json';
req.onload = function() {
  albumApp.albums = req.response;
  albumApp.albums.forEach(function (album, index) {
    album.id = index;
    album.url = "sample/" + index;
    if (album.picture)
      album.picture = "data:" + album.format + ";base64," + window.btoa(album.picture);
    else
      album.picture = "/image/default.png";
  })
  albumApp.createURL();
}
req.send(null);
