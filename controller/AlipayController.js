var alipay = require('../useAlipay');

alipay.on('verify_fail', function(){console.log('emit verify_fail')})
	.on('create_direct_pay_by_user_trade_finished', function(out_trade_no, trade_no){})
	.on('create_direct_pay_by_user_trade_success', function(out_trade_no, trade_no){})
	
	
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
