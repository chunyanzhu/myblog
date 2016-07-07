var fs = require('fs');
var writeErrorLog = function(text){
	var date = new Date().toLocaleDateString().replace(/\D/g, '-');
	var dirname = __dirname.replace('/libs', '');
	var errorFileName = date + '.txt';
	//判断是否有今天的日志文件
	fs.exists(dirname + '/error_logs/' + errorFileName, function(exists){
		if(exists){
			fs.appendFile(dirname + '/error_logs/' + errorFileName, new Date().toLocaleString() + '  ' + text, function(err, data){
				if(err){
					console.log(err);
				}else{
					console.log('追加成功');
				}
			});
		}else{
			fs.writeFile(dirname + '/error_logs/' + errorFileName, new Date().toLocaleString() + '  ' + text, function(err, data){
				if(err){
					console.log(err);
				}else{
					console.log('写入成功');
				}
			});
		}
	});
};
module.exports = writeErrorLog;