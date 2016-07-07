var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
router.post('/', function(req, res, next){
	//try to send email
	var email = req.body.email;
	var code = req.body.code;
	if(!email || !code || !sessionObj){
		res.send({
			retcode: 0,
			msg: '验证失败'
		});
		return;
	}
	if(sessionObj[email]['emailCode'] == code){
		res.send({
			retcode: 1,
			msg: '验证成功'
		});
	}


});
module.exports = router;