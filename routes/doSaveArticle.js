var express = require('express');
var crypto =  require('crypto');
var router = express.Router();
var db = require('../libs/db');
var ObjectId= require('mongodb').ObjectID;
var writeErrorLog = require('../libs/writeErrorLog');

var sessionObj = require('../libs/sessionObj');
router.post('/', function(req, res, next){
	var reqData = req.body || {};
	var type = reqData.type;
	var title = reqData.title;
	var cata = reqData.cata;
	var content = reqData.content;
	var time = Date.now();
	var _id = reqData._id;
	var username = sessionObj[req.cookies.sid] && sessionObj[req.cookies.sid]['isSigned'] ? sessionObj[req.cookies.sid]['username'] : '';
	if(!username){
		res.send({
			retcode: -1,
			msg: '先登陆后发表',
			data: {
				url: '/signin?redirectURL=' + encodeURIComponent('/edit')
			}
		})
		return;	
	}

	new Promise(function(resolve, reject){
		db.open(function(err, db){
			if(err){
				reject(err);
			}else{
				resolve(db);
			}
		})
	}).then(function(db){
		return new Promise(function(resolve, reject){
			var collection = type == 1 ? 'articles' : 'draft';
			db.collection(collection, function(err, collection){
				if(err){
					reject(err);
				}else{
					resolve(collection);
				}
			});
		});
	}).then(function(collection){
		return new Promise(function(resolve, reject){
			//修改  加入草稿箱（update/create）
			if(_id){
				collection.find({_id: ObjectId(_id)}).toArray(function(err, docs){
					if(err){
						reject(err);
						return false;
					}
					var auther = docs && docs[0].auther;
					if(auther != username){
						res.send({
							retcode: -2,
							msg: '无权修改,请联系作者',
							data: {
							}
						});
						return;
					}
				});
				collection.update({_id: ObjectId(_id)},{$set: {
					cata: cata,
					time: time,
					title: title,
					content: content,
					brief: content.substring(0, 100)
				}}, function(err, doc){
					if(err || !doc){
						reject(err);
					};
					res.send({
						retcode: 1,
						msg: '保存成功',
						data: {
							url: '/post/' + _id
						}
					})
				});
			}else{
				//生成
				_id = new ObjectId();
				collection.insert({
					_id: _id,
					auther: username,
					cata: cata,
					time: time,
					title: title,
					content: content,
					brief: content.substring(0,100),
					fav: [],
					comment: 0,
					read: 0

				}, function(err, doc){
					if(err || !doc){
						reject(err);
					};
					var returnUrl = type == 1 ? '/post/' + _id : '/draft/' + _id;
					res.send({
						retcode: 1,
						msg: '保存成功',
						data: {
							url: returnUrl
						}
					})
				});
			}
			
		});
	}).catch(function(err){
		writeErrorLog(__filename + ': ' + JSON.stringify(err));
		res.send({
			retcode: 1,
			msg: '保存失败'
		})
	});
	

});
module.exports = router;