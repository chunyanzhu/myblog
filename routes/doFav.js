var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
var writeErrorLog = require('../libs/writeErrorLog');
router.post('/', function(req, res, next){
	var reqData = req.body || {};
	var article_id = reqData.article_id;
	var sid = req.cookies.sid;
	var username = sessionObj[sid]['username'];
	new Promise(function(resolve, reject){
		db.collection('articles', function(err, collection){
			if(err){
				reject(err);
				return;
			}
			collection.find({_id: ObjectId(article_id)}).toArray(function(err, docs){
				if(err){
					reject(err);
					return;
				}
				var fav = docs[0].fav || [];
				fav.push(username);
				var len = fav.length;
				collection.update({_id: ObjectId(article_id)}, {$set: {fav: fav}}, function(err, result){
					if(err){
						reject(err);
					}
					res.send({
						retcode: 1,
						msg: '成功点赞',
						data: {
							favNum: len
						}
					})
				});
			});

		});
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.send({
			retcode: 0,
			msg: err
		});
	});
	
});
module.exports = router;