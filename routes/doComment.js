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
	var comment = reqData.comment;
	var sid = req.cookies.sid;
	var username =sessionObj[sid] &&  sessionObj[sid]['username'];
	if(!username){
		res.send({
			retcode: -1,
			msg: '先登陆后评论',
			data: {
				url: '/signin?redirectURL=' + encodeURIComponent('/post/' + article_id)
			}
		});
		return;
	}
	new Promise(function(resolve, reject){
		db.collection('comments', function(err, collection){
			if(err){
				reject(err);
				return;
			}
			
			collection.insert({
				articleId: article_id,
				comment: comment,
				time: Date.now(),
				auther: username
			}, function(err, docs){
				if(err){
					reject(err);
					return;
				}
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
						var doc = docs[0];
						var commentNum = doc.comment || 0;
						collection.update({_id: ObjectId(article_id)}, {$set: {comment: commentNum + 1}}, function(err, reuslt){
							if(err){
								reject(err);
								return;
							}
							res.send({
								retcode: 1,
								msg: '评论成功',
								data: {
									time: Date.now(),
									comment: comment,
									auther: username
								}
							});
						});
					});
				})
				
			});

		});
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.send({
			retcode: 0,
			msg: err
		})
	});
	
});
module.exports = router;