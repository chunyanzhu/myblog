var express = require('express');
var router = express.Router();
var db = require('../libs/db');
var ObjectId= require('mongodb').ObjectID;
var sessionObj = require('../libs/sessionObj');
var writeErrorLog = require('../libs/writeErrorLog');
/* GET home page. */
router.get('/', function(req, res, next) {
	var originalUrl = req.originalUrl;
	var articleId;
	var articleInfo = {};
	var isAuther = false;
	var collection = req.params.type == 1 ? 'articles' :  'draft';
	if(/edit\/(\w+)/.test(originalUrl)){
		articleId = /edit\/(\w+)/.exec(originalUrl)[1];
		new Promise(function(resolve, reject){
			db.open(function(err, db){
				if(err){
					reject(err);
					return;
				}
				db.collection(collection, function(err, collection){
					if(err){
						reject(err);
						return;
					}
					collection.find({_id: ObjectId(articleId)}).toArray(function(err, docs){
						if(err){
							reject(err);
							return;
						}
						articleInfo = docs.length && docs[0];
						//不是本人无法修改
						var auther = articleInfo.auther;
						var sid = req.cookies.sid;
						var username = sessionObj && sessionObj[sid] && sessionObj[sid].isSigned ? sessionObj[sid].username: '';
						if(auther == username){
							isAuther = true;
						}
						res.render('edit', {
					  		title: '编辑',
					  		catas: require('../libs/catas'),
					  		article: articleInfo,
					  		isAuther: isAuther
					  	});
					});
				});
			});
		}).catch(function(err){
			writeErrorLog(__filename + ': ' + JSON.stringify(err));
			res.render('edit', {
		  		title: '编辑',
		  		catas: require('../libs/catas'),
		  		article: articleInfo,
		  		isAuther: isAuther
		  	});
		});
	}else{
		res.render('edit', {
	  		title: '编辑',
	  		catas: require('../libs/catas'),
	  		article: articleInfo,
	  		isAuther: isAuther
	  	});
	}
  	
});

module.exports = router;
