$('.savePersonEdit').on('click', function(){
	var type = $('input[name=type]').val();
	var val = $('input[name='+type+']').val();
	$.ajax({
		url: '/doPersonEdit',
		type: 'POST',
		data: {
			name: type,
			val: val
		},
		success: function(resp){
			if(resp.retcode == 1){
				//修改成功
				window.location.href = '/person';
			}else{
				alert(resp.msg);
			}
		},
		error: function(){
			alert('系统故障请重试');
		}
	});
});