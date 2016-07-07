var express = require('express');
var router = express.Router();
var crypto =  require('crypto');
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
var getUserInfoBySession = require('../libs/getUserInfoBySession');
var writeErrorLog = require('../libs/writeErrorLog');
var ObjectId= require('mongodb').ObjectID;
/* GET home page. */
router.get('/', function(req, res, next) {
	var originalUrl = req.originalUrl;
	var sid = req.cookies.sid;
	var username = sessionObj && sessionObj[sid] && sessionObj[sid].isSigned ? sessionObj[sid].username: '';
	//作者是否是用户
	var isAuther = false;
	var reg = /\/draft\/(\w+)/;
	var reg_arr = reg.exec(originalUrl);
	new Promise(function(resolve, reject){
		if(!reg_arr || reg_arr.length < 1){
			reject('没有找到文章id');
		}else{
			resolve();
		}
	})
	.then(function(){
		return new Promise(function(resolve, reject){
			var article_id = reg_arr && reg_arr.length ? reg_arr[1] : '';
			if(!article_id){
				reject('1没有找到文章id');
			}else{
				resolve(article_id);
				//如果下面的then需要上一步的变量 需要return
			}
		});
	})
	.then(function(article_id){
		return new Promise(function(resolve, reject){
			db.open(function(err, db){
				if(err){
					reject(err);
					return;
				}
				db.collection('draft', function(err, collection){
					if(err){
						reject(err);
						return;
					}
					collection.find({_id: ObjectId(article_id)}).toArray(function(err, docs){
						if(err){
							reject(err);
							return;
						}
						if(!docs.length){
							reject(err);
							return;
						}
						var articleInfo = docs[0];
						var auther = articleInfo.auther;

						if(username == auther){
							isAuther = true;
						}else{
							reject();
							return;
						}

						
						db.collection('comments', function(err, collection){
							if(err){
								reject(err);
								return;
							}
							collection.find({articleId : article_id}).toArray(function(err, docs){
								if(err){
									reject(err);
									return;
								}
								var doc = docs[0] || [];
								var read = doc.read || 0;
								collection.update({articleId: article_id}, {$set: {read: read++}}, function(err, result){
									res.render('draft', {
										id: article_id,
										title: articleInfo.title,
										articleInfo: articleInfo,
										isAuther: isAuther
									});
								});
								
							})
						});
						
					});
				});
			})
			
		});
	})
	.catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.render('draft', {
			title: '找不到您要查看的文章',
			articleInfo: {},
			autherInfo: {},
			comments: []
		});
	});
	
});

module.exports = router;
