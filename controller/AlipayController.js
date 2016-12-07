var alipay = require('../useAlipay');

alipay.on('verify_fail', function(res){
		//鉴权失败
		console.log('emit verify_fail');
		if(res){
			res.status(500);
			res.render('error', {
				message: 'verify_fail',
				error: {}
			});
		}
	})
	.on('create_direct_pay_by_user_trade_finished', function(tradeResult,res){
		//即时到帐支付成功需要做的操作
		if(res){
			res.render('paysuccess',{result:tradeResult});
		}
	})
	.on('create_direct_pay_by_user_trade_success', function(tradeResult,res){
		//即时到帐支付成功需要做的操作
		if(res){
			res.render('paysuccess',{result:tradeResult});
		}
	})
	.on('alipay_wap_create_direct_pay_by_user_trade_success', function(tradeResult,res){
		//手机网站支付成功需要做的操作
		if(res){
			res.render('paysuccess',{result:tradeResult});
		}
	})
	.on('alipay_wap_create_direct_pay_by_user_trade_success', function(tradeResult,res){
		//手机网站支付成功需要做的操作
		if(res){
			res.render('paysuccess',{result:tradeResult});
		}
	})
	.on('user_auth_quick_login_success', function (alipayUser,res) {
		//登录成功需要做的操作
		res.redirect('/');
	});
	
	
exports.create_direct_pay_by_user = function(req, res){
	var method = req.method.toLowerCase();
	if(method == 'get'){
		res.render('index');
	}
	else if(method == 'post'){

		//页面需要传递
		/**
		 * out_trade_no 商户网站唯一订单号   不能为空
		 * subject 商品的标题/交易标题/订单标题/订单关键字等  该参数最长为128个汉字    不能为空
		 * total_fee 交易金额 单位为RMB-Yuan。取值范围为[0.01，100000000.00]，精确到小数点后两位   不能为空
		 * show_url  商品展示网址   可以为空
		 * body 商品描述  对一笔交易的具体描述信息 可以为空
		 * @type {{out_trade_no: *, subject: *, total_fee: *, body: *, show_url: *}}
		 */

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


exports.alipay_wap_create_direct_pay_by_user = function(req, res){
	var method = req.method.toLowerCase();
	if(method == 'get'){
		res.render('wappay');
	}
	else if(method == 'post'){

		//页面需要传递
		/**
		 * out_trade_no 商户网站唯一订单号   不能为空
		 * subject 商品的标题/交易标题/订单标题/订单关键字等  该参数最长为128个汉字    不能为空
		 * total_fee 交易金额 单位为RMB-Yuan。取值范围为[0.01，100000000.00]，精确到小数点后两位   不能为空
		 * show_url  商品展示网址   可以为空
		 * body 商品描述  对一笔交易的具体描述信息 可以为空
		 * @type {{out_trade_no: *, subject: *, total_fee: *, body: *, show_url: *}}
		 */

		var data = {
			out_trade_no:req.body.WIDout_trade_no
			,subject:req.body.WIDsubject
			,total_fee:req.body.WIDtotal_fee
			,body: req.body.WIDbody
			// ,show_url:req.body.WIDshow_url
		};
		console.log('====debug===',data);
		alipay.alipay_wap_create_direct_pay_by_user(data, res);
	}
};