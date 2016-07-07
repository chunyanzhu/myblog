var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
var writeErrorLog = require('../libs/writeErrorLog');
router.post('/', function(req, res, next){
	var redirectURL = req.body.redirectURL;
	var reqData = req.body || {};
	var username = reqData.username;
	var email = reqData.email;
	var password = reqData.password;
	var confrim_password = reqData.confrim_password;
	new Promise(function(resolve, reject){
		if(!username){
			reject('请输入用户名');
		}
		if(!password){
			reject('请输入密码');
		}
		resolve();
	}).then(function(){
		return new Promise(function(resolve, reject){

			db.open(function(err, db){
				if(err){
					reject(err);
				}
				else{
					db.collection('users', function(err, collection){
						var password_md5 = crypto.createHash('md5').update(password).digest('utf8');
						collection.find({username: username, password: password_md5}).toArray(function(err, docs){
							if(err) throw err;
							else{
								if(!docs.length){
									reject('用户不存在');
									return;
								}
								var doc = docs[0];
								//写session cookie
								var sid_md5= crypto.createHash('md5').update(username).digest('base64');
								res.cookie('sid', sid_md5, {httpOnly: true});
								if(Object.keys(sessionObj).length && sessionObj[sid_md5] && sessionObj[sid_md5]['isSigned']){
									reject('您已登陆');
									return;
								}
								if(!sessionObj[sid_md5]){
									sessionObj[sid_md5] = {};
								}
								
								sessionObj[sid_md5]['isSigned'] = true;
								sessionObj[sid_md5]['username'] = username;
								//sessionObj[sid_md5]['userInfo'] = {};
								//sessionObj[sid_md5]['userInfo'].username = username;
								//sessionObj[sid_md5]['userInfo'].email = doc.email;
								
								//res.cookie('username', username);

								//req.session = {};
								//req.session[sid_md5] = {};
								//req.session[sid_md5].isSigned = true; 
								res.send({
									retcode: 1,
									msg: '登陆成功',
									data: {
										redirectURL: redirectURL
									}
								});
							}
						});
					});
					
				}
			});
		});
			
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.send({
			retcode: 0,
			msg: '登陆失败'
		});
	});
});
module.exports = router;