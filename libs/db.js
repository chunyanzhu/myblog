var mongo = require('mongodb');
var host = 'localhost';
var port = 27017;
var server  = new mongo.Server(host, port, {auto_reconnect: true});
var db = new mongo.Db('myblogDb', server, {safe: true});
var writeErrorLog = require('./writeErrorLog');
console.log('openCalled:' + mongo.openCalled);
db.on('close', function (err, db) {
	if(err){
		writeErrorLog(JSON.stringify(err));
		throw err;
	}
});
module.exports = db;