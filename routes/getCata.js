var express = require('express');
var router = express.Router();
/* GET home page. */
router.post('/', function(req, res, next) {
	var catas = require('../libs/catas');
	res.send({
		retcode: 1,
		msg: '成功获取分类',
		data: {
			catas: catas
		}
	})
});

module.exports = router;
