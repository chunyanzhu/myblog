var db = require('./db');
var sessionObj = require('./sessionObj');
function getUserInfoBySession(req, res, next){
	var sid = req.cookies.sid;
	var username = sessionObj[sid]['username'];
	var userInfo = {};
	db.open(function(err, db){
		if(err){
			throw err;
			return;
		}
		db.collection('users', function(err, collection){
			if(err){
				throw err;
			}
			collection.find({username: username}).toArray(function(err, docs){
				if(err){
					throw err;
					return;
				}
				if(docs.length){
					next(docs[0]);
				}
			});
		});
	});
}
module.exports = getUserInfoBySession;
