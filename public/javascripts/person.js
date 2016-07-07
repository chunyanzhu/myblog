$('input[name=uploadPhoto]').on('change', function(e){
	var file = this.files[0];
	if(!file){
		alert('请选择图片');
		return;
	}
	var fileReader = new FileReader();
	fileReader.readAsDataURL(file);
	fileReader.onload = function(e){
		$('.photo_img')[0].src = this.result;
	};
	//上传图片
	var fd = new FormData();
	fd.append('headPhoto', file);
	/*$.ajax({
		url: '/uploadPhoto',
		type: 'POST',
		data: fd,
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		success: function(resp){
			//
		},
		error: function(resp){
			alert(resp.msg);
		}
	});*/
	var photo_loading_mask = $('.photo_loading_mask');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		var readyState = xhr.readyState;
		if(readyState == 1){
			photo_loading_mask.height('80%');
		}else if(readyState == 2){
			photo_loading_mask.height('50%');
		}else if(readyState == 3){
			photo_loading_mask.height('20%');
		}else if(readyState == 4 && xhr.status == 200){
            //alert(xhr.responseText);
            var resp = JSON.parse(xhr.responseText);
            if(resp.retcode == 1){
            	//成功
            	photo_loading_mask.height(0);
            }else{
            	alert(resp.msg);
            }
        }
    }
    xhr.open('post','/doUploadPhoto');
    xhr.send(fd);
    /*fetch('/uploadPhoto',{
    	method: 'post',
    	body: fd
    }).then(function(){

    }).then(function(){

    })*/
	
});