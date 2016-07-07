var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var db = require('../libs/db');
var writeErrorLog = require('../libs/writeErrorLog');
router.post('/', function(req, res, next){
	var reqData = req.body || {};
	var username = reqData.username;
	var email = reqData.email;
	var password = reqData.password;
	var confrim_password = reqData.confrim_password;
	new Promise(function(resolve, reject){
		if(!username){
			reject('用户名不正确');
		}
		if(!email){
			reject('邮箱不正确');
		}
		if(!password){
			reject('密码不正确');
		}
		if(!confrim_password){
			reject('确认密码不正确');
		}
		if(password != confrim_password){
			reject('密码与确认密码不一致');
		}
		db.open(function(err, db){
			if(err){
				reject(err);
				return;
			}
			db.collection('users', function(err, collection){
				collection.find({$or:[{username: username}, {email: email}]}).toArray(function(err, docs){
					if(err) throw err;
					else{
						if(docs.length){
							var signUped = docs.some(function(v){
								return v['email'] == email;
							});
							var sameName = docs.some(function(v){
								return v['username'] == username;
							})
							if(signUped){
								reject('改邮箱已注册，请直接登陆');
								return;
							}
							if(sameName){
								reject('用户名已被占用');
								return; 
							}						
						}
						resolve();
					}
				});
			});
			
		});
	}).then(function(){
		db.open(function(err, db){
			if(err){
				reject(err);
			}
			else{
				db.collection('users', function(err, collection){
					collection.insert({
						username: username,
						email: email,
						password: crypto.createHash('md5').update(password).digest('utf8'),
						userInfo: {}
					}, function(err, docs){
						res.send({
							retcode: 1,
							msg: '注册成功'
						});
					});
				});
				
			}
		});		
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.send({
			retcode: 0,
			msg: err
		});
	});	
});
module.exports = router;