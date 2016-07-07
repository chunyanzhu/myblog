var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var nodemailer = require('nodemailer');
var sessionObj = require('../libs/sessionObj');
var writeErrorLog = require('../libs/writeErrorLog');
router.post('/', function(req, res, next){
	//try to send email
	var userEmail = req.body.email;
	new Promise(function(resolve, reject){

	});
	if(!userEmail){
		writeErrorLog(__filename + ': ' + '邮箱不能为空');
	    res.send({
	    	retcode: 0,
	    	msg: '邮箱不能为空'
	    });
		return;
	}

	var arrNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
	var code = '';
	for(var i = 0; i < 4; i++){
		code += arrNum[parseInt(10*Math.random())];
	}
	sessionObj[userEmail] = {};
	sessionObj[userEmail]['emailCode'] = code;
	var transporter = nodemailer.createTransport("SMTP", {
	  host: 'smtp.qq.com',
	  port: 25,
	  secure: false, // use SSL
	  auth: {
	      user: '215098516@qq.com',
	      pass: 'nouyibfpktvnbiah'
	  }
	});
	transporter.sendMail({
	  from: '215098516@qq.com',
	  to: userEmail,
	  subject: '朱春艳的博客',
	  generateTextFromHTML: true,
	  html: '<p>您正在找回<a href="">朱春艳的博客</a>的密码，验证码为<span style="color: red">' + code + '</span></p>'
	}, function(error, response){
	  if(error){
	    writeErrorLog(__filename + ': ' + JSON.stringify(error));
	    res.send({
	    	retcode: 0,
	    	msg: '验证码发送失败'
	    });
	  }else{
	    res.send({
	    	retcode: 1,
	    	msg: '验证码发送成功'
	    });
	  }
	  transporter.close();
	});


});
module.exports = router;