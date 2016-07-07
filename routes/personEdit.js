var express = require('express');
var router = express.Router();
var db = require('../libs/db');
var getUserInfoBySession = require('../libs/getUserInfoBySession');
/* GET home page. */
router.get('/', function(req, res, next) {
	var type = req.query.type;
	new Promise(function(resolve, reject){
		getUserInfoBySession(req, res, function(userInfo){
			resolve(userInfo);
		});
	}).then(function(userInfo){
		res.render('personEdit', 
			{	
				type: type,
				title: '修改个人资料',
				userInfo: userInfo
			}
		);
	}).catch(function(err){
		console.dir(err)
	})
});

module.exports = router;
