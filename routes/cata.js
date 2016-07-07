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
	var reg = /\/cata\/(\w+)/;
	var reg_arr = reg.exec(originalUrl);
	var cata = reg_arr && reg_arr.length > 0 ? reg_arr[1] : '';
	var catas = require('../libs/catas');
	var cataText = '';
	catas.forEach(function(v, i){
		if(v.key == cata){
			cataText = v.value;
		}
	});
	new Promise(function(resolve, reject){
		db.open(function(err, db){
			if(err){
				reject(err);
				return;
			}
			db.collection('articles', function(err, collection){
				if(err){
					reject(err);
					return;
				}
				collection.find({cata: cata}).toArray(function(err, docs){
					if(err){
						reject(err);
						return;
					}
					res.render('cata', {
						title: cataText,
						articles: docs
					});
				});
			});
		});
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.render('user',{
			title: cataText,
			articles: []
		});
	});
  	
});

module.exports = router;
