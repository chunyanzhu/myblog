var express = require('express');
var router = express.Router();
var captchapng = require('captchapng');
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
/* GET home page. */
router.get('/', function(req, res, next) {
	var captchatext = parseInt(Math.random()*9000 + 1000);
	var dateStr = req.query.v;
	var p = new captchapng(80, 30, captchatext);
	p.color(0, 0, 0, 0);
	p.color(80, 80, 80, 255);
	var img = p.getBase64();
	var imgbase64 = new Buffer(img, 'base64');
	/*req.writeHead(200, {
		'Content-Type': 'image/png'
	});*/
	
	//var sid = req.cookies.sid;
	/*db.open(function(err, db){
		db.collection('users', function(err, db){

		});
	});*/
	sessionObj[sid]['captcha'] = captchatext;
	res.end(imgbase64);

	//创建captcha数据库
	/*db.open(function(err, db){
		if(err){
			throw err;
			return;
		}
		db.collection('captchapng', function(err, db){
			if(err){
				throw err;
				return;
			}
			db.insert({
				id: dateStr,
				text: captchatext
			}, function(err, docs){
				if(err){
					throw err;
					return;
				}
			});
		});
	});*/
});

module.exports = router;
