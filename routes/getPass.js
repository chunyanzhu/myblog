var express = require('express');
var router = express.Router();
var captchapng = require('captchapng');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('getPass', {
  		title: '找回密码',
  		captchapng: ''
  	});  	
});

module.exports = router;
