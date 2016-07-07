var um = UM.getEditor('myEditor');
//um.execCommand('insertHtml', content);
/* var arr = [];
        arr.push("使用editor.setContent('欢迎使用umeditor')方法可以设置编辑器的内容");
        um.setContent(content, false);*/
//保存文章
$('.savePost').on('click', function(){
	saveArticel(1);
});
//保存为草稿
$('.saveDraft').on('click', function(){
	saveArticel(2);
});

function saveArticel(type){
	var title = $('[name=title]').val();
	var cata = $('[name=cata]').val();
	var content = UM.getEditor('myEditor').getContent();
	var regArr = /edit\/(\w+)/.exec(window.location.href);
	var articleId = regArr && regArr.length >1 ? regArr[1] : '';
	$.ajax({
		url: '/doSaveArticle',
		type: 'POST',
		data: {
			title: title,
			cata: cata,
			content: content,
			type: type,
			_id: articleId
		},
		success: function(resp){
			if(resp.retcode == 1){
				var redirectUrl = resp.data && resp.data.url;
				redirectUrl && (window.location.href = redirectUrl);
			}else{
				alert(resp.msg);
				if(resp.retcode == -1){
					window.location.href = resp.data.url;
				}
			}
		},
		error: function(){
			alert('系统故障，请重试');
		}
	})
}
