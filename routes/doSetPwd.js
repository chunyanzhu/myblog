var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var db = require('../libs/db');
var writeErrorLog = require('../libs/writeErrorLog');
router.post('/', function(req, res, next){
	var email = req.body.email;
	var pwd = req.body.pwd;
	var confrim_pwd = req.body.confrim_pwd;
	if(pwd != confrim_pwd){
		res.send({
			retcode: 0,
			msg: '请确保密码一致'
		});
		return;
	}
	new Promise(function(resolve, reject){
		db.open(function(err, db){
			if(err){
				reject(err)
				return;
			}
			db.collection('users', function(err, collection){
				if(err){
					reject(err);
					return;
				}
				collection.update({email: email},{$set: {password: crypto.createHash('md5').update(pwd).digest('utf8')}}, function(err, result){
					if(err){
						reject(err);
					}else{
						res.send({
							retcode: 1,
							msg: '密码修改成功'
						});
					}
				});
			});
		});
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.send({
			retcode: 0,
			msg: JSON.stringify(err)
		});
	});
	

});
module.exports = router;