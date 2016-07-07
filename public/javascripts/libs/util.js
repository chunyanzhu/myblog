var cookieManage = {
	get: function(name) {
		var cookie = document.cookie;
		//"sid=_%EF%BF%BD%EF%BF%BD%22%EF%BF%BD%3B%EF%BF%BD%EF%BF%BDT%22%0E%1B%16%04%EF%BF%BD%16; username=zhuchunyan"
		var reg = new RegExp(name + '=([^;]+)');
		var regArr = reg.exec(cookie);
		return regArr && regArr.length > 1 ? regArr[1] : '';
	}
}