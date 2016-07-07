var express = require('express');
var router = express.Router();
var captchapng = require('captchapng');
var db = require('../libs/db');
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
	var MIME = {
		'css' : 'text/css',
		'js' : 'applocation/javascript',
		'html' :'text/html; charset=utf-8',
		'jpg' : 'image/jpeg'
	};
	var filePath = req.originalUrl;
	var fileType = filePath.split('.')[1];
	var baseUrl = __dirname.replace('routes', '');
	fs.readFile(baseUrl + filePath, function(err, data){
		if(err){
			res.writeHead(404);
			res.end(err.message);
		}else{
			res.writeHead(200,{
				'Content-Type': MIME[fileType]
			});
			res.end(data);
		}
	})
});

module.exports = router;
