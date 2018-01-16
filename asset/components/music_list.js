var url = "http://localhost:8080/"
var server_url = "http://143.248.132.112:80/"

var req = new XMLHttpRequest();

// visibility filters
var filters = {
  all: function (albums) {
    return albums
  },
  active: function (albums) {
    return albums.filter(function (album) {
      return !album.completed
    })
  },
  completed: function (albums) {
    return albums.filter(function (album) {
      return album.completed
    })
  }
}

// app Vue instance
var app = new Vue({
  // app initial state
  data: {
    albums: [],
    visibility: 'all'
  },

  // watch albums change for localStorage persistence
  watch: {
    albums: {
      handler: function (albums) {
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.albums)
    },
    remaining: function () {
      return filters.active(this.albums).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        this.albums.forEach(function (album) {
          album.completed = value
        })
      }
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.albums.push({
        title: value,
        completed: false
      })
      this.newTodo = ''
    },

    removeTodo: function (album) {
      this.albums.splice(this.albums.indexOf(album), 1)
    },

    editTodo: function (album) {
      this.beforeEditCache = album.title
      this.editedTodo = album
    },

    doneEdit: function (album) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      album.title = album.title.trim()
      if (!album.title) {
        this.removeTodo(album)
      }
    },

    cancelEdit: function (album) {
      this.editedTodo = null
      album.title = this.beforeEditCache
    },

    removeCompleted: function () {
      this.albums = filters.active(this.albums)
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'album-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
})

// mount
app.$mount('.albumApp')

// get server data
req.open('GET', url + "api/music", true);
req.responseType = 'json';
req.onload = function() {
  app.albums = req.response;
  app.albums.forEach(function (album, index) {
    album.id = index;
    album.picture = url + "image/" + album.title + ".jpg";
    console.log(album.picture)
  })
}
req.send(null);
