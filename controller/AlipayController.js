var alipay = require('../useAlipay');

alipay.on('verify_fail', function(res){
		//鉴权失败
		console.log('emit verify_fail');
		if(res){
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: {}
			});
		}
	})
	.on('create_direct_pay_by_user_trade_finished', function(out_trade_no, trade_no,res){
		//支付成功需要做的操作
		if(res){

		}
	})
	.on('create_direct_pay_by_user_trade_success', function(out_trade_no, trade_no,res){
		//支付成功需要做的操作
		if(res){

		}
	})
	.on('user_auth_quick_login_success', function (alipayUser,res) {
		//登录成功需要做的操作
		res.redirect('/');
	});
	
	
exports.create_direct_pay_by_user = function(req, res){
	var method = req.method.toLowerCase();
	if(method == 'get'){
		res.render('create_direct_pay_by_user');
	}
	else if(method == 'post'){
		var data = {
			out_trade_no:req.body.WIDout_trade_no
			,subject:req.body.WIDsubject
			,total_fee:req.body.WIDtotal_fee
			,body: req.body.WIDbody
			,show_url:req.body.WIDshow_url
		};

		alipay.create_direct_pay_by_user(data, res);
	}
};

exports.user_auth_quick_login = function(req, res){

	var data = {
		exter_invoke_ip:''
	};

	alipay.user_auth_quick_login(data, res);
};
