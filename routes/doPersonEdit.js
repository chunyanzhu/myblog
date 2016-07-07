var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
router.post('/', function(req, res, next){
	var sid = req.cookies.sid;
	var username = sessionObj[sid]['username'];
	var reqData = req.body || {};
	var name = reqData.name;
	var val = reqData.val;
	new Promise(function(resolve, reject){
		db.open(function(err, db){
			if(err){
				reject('15' + err);
			}else{
				resolve();
			}
		})
	})
	.then(function(resolve, reject){
		return new Promise(function(resolve, reject){
			db.collection('users', function(err, collection){
				if(err){
					reject('25' + err);
				}else{
					resolve(collection);
				}
			})
		})
		
	})
	.then(function(collection){
		return new Promise(function(resolve, reject){
			if(name == 'username'){
				collection.update({username: username},{$set: {username: val}}, function(err, result){
					if(err){
						reject('39' + err);
					}else{
						resolve();
					}
				});
			}else if(name == 'email'){
				collection.update({username: username},{$set: {email: val}}, function(err, result){
					if(err){
						reject('48' + err);
					}else{
						resolve();
					}
				});
			}else if(name == 'address' || name == 'phone' || name == 'qq'){
				collection.find({username: username}).toArray(function(err, docs){
					if(err){
						reject('57' + err);
						return;
					}

					if(!docs.length){
						reject('没有找到相应的用户信息');
						return;
					}
					var doc = docs[0];
					var userInfo = doc.userInfo || {};
					userInfo[name] = val; 
					collection.update({username: username},{$set: {userInfo: userInfo}}, function(err, result){
						if(err){
							reject('70' + err);
						}else{
							resolve();
						}
					});
				});
			}
			/*switch(name){
				case 'username':
					collection.update({username: username},{$set: {username: val}}, function(err, result){
						if(err){
							reject('39' + err);
						}else{
							resolve();
						}
					});
					break;
				case 'email':
					collection.update({username: username},{$set: {email: val}}, function(err, result){
						if(err){
							reject('48' + err);
						}else{
							resolve();
						}
					});
					break;
				default: 
					collection.find({username: username}).toArray(function(err, docs){
						if(err){
							reject('57' + err);
							return;
						}

						if(!docs.length){
							reject('没有找到相应的用户信息');
							return;
						}
						var doc = docs[0];
						var userInfo = doc.userInfo || {};
						userInfo[name] = val; 
						collection.update({username: username},{$set: {userInfo: userInfo}}, function(err, result){
							if(err){
								reject('70' + err);
							}else{
								resolve();
							}
						});
					});
					
			}*/
		})
		
	})
	.then(function(){
		res.send({
			retcode:　1,
			msg: '保存成功'
		});
	})
	.catch(function(err){
		console.dir(err);
		res.send({
			retcode:　0,
			msg: '修改失败'
		});
	});
});
module.exports = router;