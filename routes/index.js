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
	var sid = req.cookies.sid;
	var getUserInfo = new Promise(function(resolve, reject){
		if(!sid || !sessionObj || !sessionObj[sid] || !sessionObj[sid]['isSigned']){
			resolve({});
		}else{
			getUserInfoBySession(req, res, function(userInfo){
				resolve(userInfo);
			});
		}
	});
	var getArticles = new Promise(function(resolve, reject){
		db.open(function(err, db){
			if(err){
				writeErrorLog(__filename + ': ' + JSON.stringify(err));
				resolve([]);
			}else{
				db.collection('articles', function(err, collection){
					if(err){
						writeErrorLog(__filename + ': ' + JSON.stringify(err));
						resolve([]);
						return;
					}
					collection.find({}).toArray(function(err, docs){
						if(err){
							writeErrorLog(__filename + ': ' + JSON.stringify(err));
							resolve([]);
							return;
						}
						if(docs.length){
							resolve(docs);
						}else{
							resolve([]);
						}
						
					});
				})
			}
		});
	});

	Promise.all([getUserInfo, getArticles]).then(function(data){
		var userInfo = data.length > 0 && data[0];
		var articles = data.length > 1 && data[1];
		var articlesOnePage = [];
		if(articles.length > pageSize){
			articles.forEach(function(v, i){
				if(i < pageSize){
					articlesOnePage.push(v);
				}
			});
		}
		articles = articles.length > pageSize ? articlesOnePage : articles;
		var hasMore = articles.length > pageSize ? true : false;
		res.render('index', {
			title: '朱春艳的博客',
			signed: !!sessionObj[sid],
			userInfo: userInfo,
			articles: articles,
			hasMore: hasMore
		});
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
	});
  	
});

module.exports = router;
