//show person detail
$('.photo_img').on('mouseover', function(){
	$('.userBox').show();
});
$('.photo_img').on('mouseout', function(){
	$('.userBox').hide();
});
$('.userBox').on('mouseover', function(){
	$('.userBox').show();
});
$('.userBox').on('mouseout', function(){
	$('.userBox').hide();
});
//signout
$('body').on('click', '#signout', function(){
	var username = cookieManage && cookieManage.get('username');
	var sid = cookieManage && cookieManage.get('sid');
	$.ajax({
		url: '/doSignout',
		type: 'POST',
		data: {
			username: username,
			sid: sid
		},
		success: function(data){
			if(data.retcode == 1){
				window.location.reload();
			}else{
				alert(data.msg);
			}
			
		}
	});
	
});