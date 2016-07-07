$('.signinBtn').on('click', function(){
	doSignin();
});

$(document).on('keydown', function(event){
	if(event.keyCode == 13){
		doSignin();
	}
});

var doSignin = function(){
	var username = $('input[name=username]').val();
	var password = $('input[name=password]').val();
	var reg = /redirectURL=([^\&]+)/;
	var regArr = reg.exec(window.location.href);
	var redirectURL = regArr && regArr.length > 1 ? regArr[1] : '';
	$.ajax({
		url: '/doSignin',
		type: 'POST',
		data: {
			username: username,
			password: password,
			redirectURL: redirectURL
		},
		success: function(data){
			if(data.retcode == 1){
				var redirectURL = decodeURIComponent(data.data.redirectURL) || '/index';
				window.location.replace(redirectURL);
			}else if(data.retcode == 0){
				alert(data.msg);
			}
		}
	});
};