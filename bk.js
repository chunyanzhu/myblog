var mongo = require('mongodb');
var host = 'localhost';
var port = 27017;
var server  = new mongo.Server(host, port, {auto_reconnect: true});

//var db = new mongo.Db('zhu_data', server, {safe: true});
var db = new mongo.Db('myblogDb', server, {safe: true});
var ObjectId= require('mongodb').ObjectID;
db.on('close', function (err, db) {
	if(err){
	
		throw err;
	}
});


//插入spider数据

var fs = require('fs');
fs.readFile(__dirname + '/articles.js', function(err, data){
	if(err){
		console.dir(err);
	}
	var articlesArr = JSON.parse(data);
	console.log(articlesArr.length);
	function insert(i){
		db.open(function(err, db){
			if(err){
				console.dir(err)
			}else{
				db.collection('articles', function(err, collection){
					if(err){
						console.dir(err);
						return;
					}
					
					
						var _id = new ObjectId();
						collection.insert({
							_id: _id,
							auther: 'SpiderMan',
							cata: articlesArr[i].cata,
							time: articlesArr[i].time,
							title: articlesArr[i].title,
							content: articlesArr[i].content,
							brief: articlesArr[i].brief,
							fav: articlesArr[i].fav,
							comment: articlesArr[i].comment,
							read: articlesArr[i].read

						}, function(err, doc){
							if(err || !doc){
								console.dir(err)
							};
							console.log('----------success'+i+'---------')
							if(i < articlesArr.length -1 ){
								insert(i+1);
							}
						});
					
					
				});
			}
		});
	}
	insert(0);
	
});
