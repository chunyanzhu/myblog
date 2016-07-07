//send email
$('.sendcode').on('click', function(){
	var sendCodeSuccTip = $('.sendCodeSuccTip');
	sendCodeSuccTip.text('');
	var email = $('input[name=email]').val();
	if(!email){
		return;
	}
	$.ajax({
		url: '/doSendEmail',
		type: 'POST',
		data: {
			email: email
		},
		success: function(data){
			if(data.retcode == 1){
				sendCodeSuccTip.text('已发送成功，请查看邮箱');
			}else{
				sendCodeSuccTip.text('发送失败，请重试');
				alert(data.msg);
			}
			
		}
	});
});


$('.getPassBtn').on('click', function(){
	var email = $('input[name=email]').val();
	var code = $('input[name=code]').val();
	$.ajax({
		url: '/doGetPass',
		type: 'POST',
		data: {
			email: email,
			code: code
		},
		success: function(data){
			if(data.retcode == 1){
				//window.location.reload();
				$('#part1').hide();
				$('#part2').show();
			}else{
				alert(data.msg);
			}
			
		}
	});
});


// save new password
$('.saveNewPwd').on('click', function(){
	var pwd = $('input[name=pwd]').val();
	var confrim_pwd = $('input[name=confrim_pwd]').val();
	if(pwd !== confrim_pwd){
		alert('请确保密码一致');
		return;
	}
	$.ajax({
		url: '/doSetPwd',
		type: 'POST',
		data: {
			email: $('input[name=email]').val(),
			pwd: pwd,
			confrim_pwd: confrim_pwd
		},
		success: function(data){
			if(data.retcode == 1){
				//调到登陆页
				window.location.href = '/signin';
			}else{
				alert(data.msg);
			}
			
		}
	});
});