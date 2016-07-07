$.ajax({
	url: '/getCata',
	type: 'POST',
	data: {},
	success: function(resp){
		if(resp.retcode == 1){
			var catas = resp.data.catas;
			var str = '<a href="/" class="sort_a tc">所有分类</a>';
			catas.forEach(function(v, i){
				if(v.key == 0){
					return;
				}
				str += '<a href="/cata/' + v.key + '" class="sort_a tc">' + v.value + '</a>';
			})
			$('.sorts').html(str);

			//
			var reg = /\/cata\/(\w+)/;
			var reg_arr = reg.exec(window.location.pathname);
			var cata = reg_arr && reg_arr.length > 0 ? reg_arr[1] : '';
			if(cata){
				$('.sorts a[href="/cata/' + cata + '"]').addClass('cur').siblings().removeClass('cur');
			}else{
				$('.sorts a').eq(0).addClass('cur').siblings().removeClass('cur');
			}
			

		}else{
			alert(resp.msg || '系统故障，请重试');
		}
	},
	error: function(){
		alert('系统故障，请重试')
	}
});
