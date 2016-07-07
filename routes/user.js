var express = require('express');
var router = express.Router();
var crypto =  require('crypto');
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
var getUserInfoBySession = require('../libs/getUserInfoBySession');
var writeErrorLog = require('../libs/writeErrorLog');
var pageSize = 10;
/* GET home page. */
router.get('/', function(req, res, next) {
	var originalUrl = req.originalUrl;
	var reg = /\/user\/(.+)/;
	var reg_arr = reg.exec(originalUrl);
	var username = reg_arr && reg_arr.length > 0 ? decodeURIComponent(reg_arr[1]) : '';
	var getArticles = new Promise(function(resolve, reject){
		db.open(function(err, db){
			if(err){
				//reject(err);
				writeErrorLog(__filename + ': ' + JSON.stringify(err));
				resolve([]);
				return;
			}
			db.collection('articles', function(err, collection){
				if(err){
					//reject(err);
					writeErrorLog(__filename + ': ' + JSON.stringify(err));
					resolve([]);
					return;
				}
				collection.find({auther: username}).toArray(function(err, docs){
					if(err){
						writeErrorLog(__filename + ': ' + JSON.stringify(err));
						reject(err);
						return;
					}
					/*res.render('user', {
						title: username,
						articles: docs
					})*/
					resolve(docs);
				})
			})
		})
	});
	var getUserInfo = new Promise(function(resolve, reject){
		db.open(function(err, db){
			if(err){
				writeErrorLog(__filename + ': ' + JSON.stringify(err));
				resolve([]);
				return;
			}
			db.collection('users', function(err, collection){
				if(err){
					writeErrorLog(__filename + ': ' + JSON.stringify(err));
					resolve({})
					return;
				}
				collection.find({username: username}).toArray(function(err, docs){
					if(err){
						writeErrorLog(__filename + ': ' + JSON.stringify(err));
						resolve({})
						return;
					}
					resolve(docs);
				})
			})
		});
	});
	Promise.all([getArticles, getUserInfo]).then(function(data){
		var articles = data.length > 0 && data[0],
			userInfo = data.length > 1 && data[1];
		res.render('user',{
			title: username,
			articles: articles,
			userInfo: userInfo[0]
		});
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
	});
  	
});

module.exports = router;
