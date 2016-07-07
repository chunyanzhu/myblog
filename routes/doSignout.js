var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
var writeErrorLog = require('../libs/writeErrorLog');
router.post('/', function(req, res, next){
	var sid = req.cookies.sid;
	new Promise(function(resolve, reject){
		if(!sid || !sessionObj || !sessionObj[sid] || !sessionObj[sid]['isSigned']){
			reject('您未登陆');
			return;
		}
		resolve();
	}).then(function(){
		res.clearCookie('sid', {});
		sessionObj[sid] = {};
		res.send({
			retcode: 1,
			msg: '退出成功'
		});
	})
	.catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.send({
			retcode: 0,
			msg: '退出失败'
		});
	});
});
module.exports = router;