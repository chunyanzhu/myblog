var express = require('express');
var crypto =  require('crypto');
var fs = require('fs');
var router = express.Router();
var db = require('../libs/db');
var sessionObj = require('../libs/sessionObj');
var writeErrorLog = require('../libs/writeErrorLog');
var multer = require('multer');
var storage = multer.diskStorage({
	//文件默认不带后缀
	destination: function(req, file, cb){
		//目录不会自动创建
		cb(null, './uploads');
	},
	filename: function(req, file, cb){
		var fileFormat = (file.originalname).split(".");
		cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
	}
});
var upload = multer({storage: storage});

router.post('/', upload.single('headPhoto'), function(req, res, next){
	//@todo 怎么测试并发  如何处理并发  筛选非image文件
	var headPhoto = req.file;
	var username = sessionObj[req.cookies.sid]['username'];
	new Promise(function(resolve, reject){
		if(!headPhoto){
			reject('请重新上传图片');
			return;
		}
		if(headPhoto.mimetype.indexOf('image') < 0){
			reject('图片格式不正确');
			return;
		}
		resolve();
	})
	.then(function(){
		new Promise(function(resolve, reject){
			db.open(function(err, db){
				if(err){
					reject(err);
					return;
				}
				db.collection('users', function(err, db){
					if(err){
						reject(err);
						return;
					}
					db.find({username: username}).toArray(function(err, docs){
						if(err){
							reject(err);
							return;
						}
						if(docs.length){
							var doc = docs[0];
							//图片地址
							doc.userInfo = doc.userInfo || {};
							doc.userInfo.headPhoto = headPhoto.path;
							db.update({username: username}, doc, function(err, result){
								if(err){
									reject(err);
									return;
								}
							});
						}else{
							reject('请重新登陆');
							return;
						}
					});
				})
			})
			res.send({
				retcode: 1,
				msg: '图片上传成功'
			});
		});
		
	})
	.catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.send({
			retcode: 0,
			msg: err
		});
	});
});
module.exports = router;