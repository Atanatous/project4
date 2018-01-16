var multer = require('multer');
var fs = require('fs');
var bodyParser = require('body-parser');
var async = require('async');
var mongo = require('mongodb');
var ffmetadata = require('ffmetadata');
var ObjectID = mongo.ObjectID;
var _storage = multer.diskStorage({
destination: function(req, file, cb){
	cb(null,'uploads/music');
	},
filename: function(req, file, cb){
	cb(null, file.originalname);
	}
	});
var mupload = multer({storage: _storage, limits:'50mb'});
var __storage = multer.diskStorage({
destination: function(req, file, cb){
	cb(null,'uploads/image');
	},
filename: function(req, file, cb){
	cb(null, file.originalname);
	}
	});
var pupload = multer({storage: __storage, limits:'50mb'});


var express = require('express');

module.exports = function(app, Info, Song, Playlist)
{
	app.use(bodyParser({limit:'50mb'}));
	//Logging in
	app.post('/api/login',function(req,res){
			console.log("In");
			Info.find({email: req.body.email, password: req.body.password},function(err, inf){
					if(err) return res.status(500).json({error:err});
					// ID is not found
					if(!inf) return res.json({result: 0});
					// ID is successfully found
					console.log("Success");
					if(inf) return res.json({result: 1});
					return ;
					}
				 )
			});
	// Sign up
	app.post('/api/register',function(req, res){
			var info = new Info();
			info.email=req.body.email;
			info.password=req.body.password;
			info.name = req.body.name;
			info.save(function(err){
					if(err){
					console.error(err);
					res.json({result: 0});
					return;
					}
					console.log("Success");
					res.json({result: 1});
					});
			});
	//Uploading music
	app.post('/api/mupload', mupload.single('mp3'), function(req,res){
			console.log(req.file.filename);
			console.log(req.file.path);
			ffmetadata.read(req.file.path,function(er,data){
				if(er) console.error("Error reading metadata", er);
				else console.log(data);
			var song = new Song();
			song.name=data.title;
			song.path=req.file.path;
			song.favorite=0;
			song.artist=data.artist;
			song.genre=data.genre;
			song.album=data.album;
			song.save(function(err){
					if(err){
					console.error(err);
					res.json({result: 0});
					return;
					}
			res.json({result: 1});
			});
			});
	});

	//Uploading Picture
	app.post('/api/pupload',pupload.single('img'),function(req, res){
			console.log(req.file.filename);
			console.log(req.file.path);
			res.json({result: 1});
			});

	// Making New playlist by user himself
	app.post('/api/newplaylist',function(req,res){
			var playlist = new Playlist();
			playlist.email= req.body.email;
			playlist.playlistname= req.body.playlistname;
			playlist.songname= req.body.songname;
			playlist.save(function(err){
					if(err){
					console.error(err);
					res.json({result: 0});
					return;
					}
					res.json({result: 1});
					});
			});
	// Getting playlist from others
	app.post('/api/otherplaylist',function(req,res){
		Playlist.find({email: req.body.email, playlistname: req.body.playlistname}, function(err,docs){
		console.log(docs);
		if(err){
		console.error(err);
		res.json({result: 0});
		return;
		}
		//Update emails to new myemail
		console.log("Trying to parse");
		for(var key=0;key<docs.length;key++){
		var playlist = new Playlist();
		playlist.email=req.body.myemail;
		playlist.playlistname=req.body.myplaylistname;
		playlist.songname=docs[key]["songname"];
		console.log(key);
		console.log(playlist.email);
		console.log(playlist.playlistname);
		console.log(playlist.songname);
		playlist.save(function(err){
				if(err){
				console.error(err);
				res.json({result: 0});
				return;
				}
				});
		}
		});
		res.json({result: 1});
		});

	// Get a Single Song from DB
	app.post('/api/song',function(req,res){
		Song.find({name: req.body.name},function(err,docs){
				console.log(docs);
				if(err){
				console.error(err);
				res.json({result: 0});
				return;
				}
				res.json(docs);
				});
		});
	// What should we do, only Playlist or all?
	app.post('/api/Allplaylist',function(req,res){
			/*
			Playlist.find(function(err,docs){
					if(err) res.status(500).send({error: 'database failure'});
					res.json(docs);
					console.log("All the playlists are sent");
					})
			});
			*/
//_id: {email: "$email", playlistname: "$playlistname"}
		Playlist.aggregate([{$group:{_id: {email: "$email", playlistname: "$playlistname"}}}]).exec(function(err,docs){
				if(err){
				console.error(err);
				res.json({result: 0});
				return;
				}
				res.json(docs);
				});
});

    // Get a Total Playlist song from DB
	app.post('/api/songplaylist',function(req,res){
			Playlist.find({playlistname: req.body.playlistname, email:req.body.email},function(err,docs){
					console.log(docs);
					if(err){
					console.error(err);
					res.json({result: 0});
					return;
					}
					res.json(docs);
					});
			});

   // Delete Users Playlist from DB
	app.post('/api/deleteplaylist',function(req, res){
			Playlist.remove({email: req.body.email, playlistname: req.body.playlistname},function(err, docs){
					if(err) return res.status(500).json({result :0});
					res.json({result :1});
					})
			});
  // Delete Users single song from his certain playlist
	app.post('/api/deletesingle', function(req, res){
			Playlist.remove({email: req.body.email, playlistname: req.body.playlistname, songname: req.body.songname},function(err,docs){
					if(err) return res.status(500).json({result :0});
					res.json({result :1});
					})
			});
  // Click Favorite music
	app.post('/api/favorite', function(req, res){
		Song.find({name: req.body.name},function(err,docs){
			console.log(docs);
			var num= docs[0]["favorite"];
			console.log(num);
			Song.update({songname: req.body.songname},{ $set:{favorite: num+1}}).exec(function(err,docs){
					console.log(docs);
					if(err){
					console.error(err);
					res.json({result: 0});
					return;
					}
					res.json({result: 1});
					})
			});

		});

  // Show Top 50
     app.post('/top50', function(req, res){
		     Song.find({}).sort({"favorite": -1}).limit(50).exec(function(err,docs){
				     if(err){
				     	console.error(err);
					res.json({result: 0});
					return ;
					}
					res.json(docs);
					});
		     });
 // Get certain person's playlist
    app.post('/usrplaylist', function(req, res){
		    Playlist.aggregate([{ $match: {'email': req.body.email}},{$group:{_id:{email: "$email", playlistname: "$playlistname"}, count: { $sum: 1}}}]).exec(function(err,re){
				    if(err){
				    console.error(err);
				    res.json({result: 0});
				    return;
				    }
				    res.json(re);
				    });
		    });
// Get certain artist's album
    app.post('/artistalbum', function(req, res){
		    Song.aggregate([{ $match: {'artist': req.body.artist}},{$group:{_id:{album: "$album"}, count: { $sum: 1}}}]).exec(function(err,re){
				    if(err){
				    console.error(err);
				    res.json({result: 0});
				    return;
				    }
				    res.json(re);
				    });
		    });
// Get a total songlist from certain artist's album
    app.post('/albumsong', function(req, res){
		    Song.find({artist: req.body.artist, album: req.body.album},function(err,docs){
				    if(err){
				    console.error(err);
				    res.json({result: 0});
				    return;
				    }
				    res.json(docs);
				    });
		    });
}
