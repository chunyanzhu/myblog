$('.signupBtn').on('click', function(){
	var username = $('input[name=username]').val();
	var email = $('input[name=email]').val();
	var password = $('input[name=password]').val();
	var confrim_password = $('input[name=confrim_password]').val();

		$.ajax({
			url: '/doSignup',
			type: 'POST',
			data: {
				username: username,
				email: email,
				password: password,
				confrim_password: confrim_password
			},
			success: function(data){
				if(data.retcode == 1){
					window.location.replace('/signin');
				}else if(data.retcode == 0){
					alert(data.msg);
				}
			}
		});

	
});