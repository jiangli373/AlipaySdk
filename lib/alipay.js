var AlipayNotify = require('./alipay_notify.class').AlipayNotify;    
var AlipaySubmit = require('./alipay_submit.class').AlipaySubmit;
var  assert = require('assert');
var url = require('url');
var inherits = require('util').inherits,
    EventEmitter = require('events').EventEmitter;
	
var DOMParser = require('xmldom').DOMParser;

var default_alipay_config = {
	partner:'' //合作身份者id，以2088开头的16位纯数字
	,key:''//安全检验码，以数字和字母组成的32位字符
	,seller_email:'' //卖家支付宝帐户 必填
	,host:'http://localhost:3000/' //域名
	,cacert:'cacert.pem'//ca证书路径地址，用于curl中ssl校验 请保证cacert.pem文件在当前文件夹目录中
	,transport:'http' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
	,input_charset:'utf-8'//字符编码格式 目前支持 gbk 或 utf-8
	,sign_type:"MD5"//签名方式 不需修改
	,create_direct_pay_by_user_return_url : '/alipay/create_direct_pay_by_user/return_url'
	,create_direct_pay_by_user_notify_url: '/alipay/create_direct_pay_by_user/notify_url'
	,user_auth_quick_login_return_url:'/alipaylogin/return_url'

};
			
function Alipay(alipay_config){		
	EventEmitter.call(this);
	
	//default config
	this.alipay_config = default_alipay_config;
	//config merge
	for(var key in alipay_config){
		this.alipay_config[key] = alipay_config[key];
	}		
}

/**
 * @ignore
 */
inherits(Alipay, EventEmitter);

Alipay.prototype.route = function(app){
	var self = this;
	app.get(this.alipay_config.create_direct_pay_by_user_return_url, function(req, res){self.create_direct_pay_by_user_return(req, res)});
	app.post(this.alipay_config.create_direct_pay_by_user_notify_url, function(req, res){self.create_direct_pay_by_user_notify(req, res)});

	app.get(this.alipay_config.user_auth_quick_login_return_url, function(req, res){self.user_auth_quick_login_return_(req, res)});
}

//支付宝即时到帐交易接口
/*data{
 out_trade_no:'' //商户订单号, 商户网站订单系统中唯一订单号，必填
 ,subject:'' //订单名称 必填
 ,total_fee:'' //付款金额,必填
 ,body:'' //订单描述
 ,show_url:'' //商品展示地址 需以http://开头的完整路径，例如：http://www.xxx.com/myorder.html
 }*/

Alipay.prototype.create_direct_pay_by_user = function(data, res){
	assert.ok(data.out_trade_no && data.subject && data.total_fee);

	//建立请求
	var alipaySubmit = new AlipaySubmit(this.alipay_config);

	var parameter = {
		service:'create_direct_pay_by_user'
		,partner:this.alipay_config.partner
		,payment_type:'1' //支付类型
		,notify_url: url.resolve(this.alipay_config.host, this.alipay_config.create_direct_pay_by_user_notify_url)//服务器异步通知页面路径,必填，不能修改, 需http://格式的完整路径，不能加?id=123这类自定义参数
		,return_url: url.resolve(this.alipay_config.host , this.alipay_config.create_direct_pay_by_user_return_url)//页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/
		,seller_email:this.alipay_config.seller_email //卖家支付宝帐户 必填		
		,_input_charset:this.alipay_config['input_charset'].toLowerCase().trim()
	};
	for(var key in data){
		parameter[key] = data[key];
	}
	
	var html_text = alipaySubmit.buildRequestForm(parameter,"get", "确认");
	res.send(html_text);
}


Alipay.prototype.create_direct_pay_by_user_notify = function(req, res){
	var self = this;

	var _POST = req.body;
	console.log('=====create_direct_pay_by_user_notify========',_POST);
	//计算得出通知验证结果
	var alipayNotify = new AlipayNotify(this.alipay_config);
	//验证消息是否是支付宝发出的合法消息
	alipayNotify.verifyNotify(_POST, function(verify_result){
		if(verify_result) {//验证成功
			//商户订单号
			var out_trade_no = _POST['out_trade_no'];
			//支付宝交易号
			var trade_no = _POST['trade_no'];
			//交易状态
			var trade_status = _POST['trade_status'];

			if(trade_status  == 'TRADE_FINISHED'){                
				self.emit('create_direct_pay_by_user_trade_finished', out_trade_no, trade_no);
			}
			else if(trade_status == 'TRADE_SUCCESS'){                
				self.emit('create_direct_pay_by_user_trade_success', out_trade_no, trade_no);
			}
			res.send("success");		//请不要修改或删除
		}
		else {
			//验证失败
			self.emit("verify_fail");
			res.send("fail");
		}
	});	
}

Alipay.prototype.create_direct_pay_by_user_return = function(req, res){		
	var self = this;
	
	var _GET = req.query;
	console.log('=====_GET========',_GET);
	//计算得出通知验证结果
	var alipayNotify = new AlipayNotify(this.alipay_config);
	alipayNotify.verifyReturn(_GET, function(verify_result){
		console.log('=====verify_result=======',verify_result);
		if(verify_result) { //验证成功
			//商户订单号
			var out_trade_no = _GET['out_trade_no'];
			//支付宝交易号
			var trade_no = _GET['trade_no'];
			//交易状态
			var trade_status = _GET['trade_status'];

			if(trade_status  == 'TRADE_FINISHED'){                
				self.emit('create_direct_pay_by_user_trade_finished', out_trade_no, trade_no,res);
			}
			else if(trade_status == 'TRADE_SUCCESS'){                
				self.emit('create_direct_pay_by_user_trade_success', out_trade_no, trade_no,res);
			}

		}
		else {
			//验证失败
			self.emit("verify_fail",res);
		}
	});
	
}


//支付宝登录接口
/*data{
 out_trade_no:'' //商户订单号, 商户网站订单系统中唯一订单号，必填
 ,subject:'' //订单名称 必填
 ,total_fee:'' //付款金额,必填
 ,body:'' //订单描述
 ,show_url:'' //商品展示地址 需以http://开头的完整路径，例如：http://www.xxx.com/myorder.html
 }*/

Alipay.prototype.user_auth_quick_login = function(data, res){
	//建立请求
	var alipaySubmit = new AlipaySubmit(this.alipay_config);

	var anti_phishing_key = this.alipay_config.is_anti_phishing_key?'':alipaySubmit.query_timestamp(); //防钓鱼时间戳  //若要使用请调用类文件submit中的query_timestamp函数

	var exter_invoke_ip = this.alipay_config.is_anti_phishing_key?'':data.exter_invoke_ip;

	var parameter = {
		service:'alipay.auth.authorize'
		,partner:this.alipay_config.partner
		,target_service:'user.auth.quick.login'
		,return_url: url.resolve(this.alipay_config.host , this.alipay_config.user_auth_quick_login_return_url)//页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/
		,anti_phishing_key:anti_phishing_key //卖家支付宝帐户 必填
		,exter_invoke_ip:exter_invoke_ip
		,_input_charset:this.alipay_config['input_charset'].toLowerCase().trim()
	};
	for(var key in data){
		parameter[key] = data[key];
	}
	var html_text = alipaySubmit.buildRequestForm(parameter,"get", "确认");
	res.send(html_text);
};

Alipay.prototype.user_auth_quick_login_return_ = function (req, res) {
	var self = this;

	var _GET = req.query;
	//console.log('=====_GET========',_GET);

	//计算得出通知验证结果
	var alipayNotify = new AlipayNotify(this.alipay_config);

	alipayNotify.verifyReturn(_GET, function(verify_result){
		//console.log('=====verify_result=======',verify_result);
		if(verify_result) { //验证成功

			var alipayUser = {
				user_id:_GET['user_id'],
				real_name:_GET['user_id'],
				email:_GET['email'],
				token:_GET['token'],
				global_buyer_email:_GET['global_buyer_email']
			};

			self.emit('user_auth_quick_login_success', alipayUser, res);

			//res.send("success");		//请不要修改或删除
		}
		else {
			//验证失败
			self.emit("verify_fail",res);
			//res.send("fail");
		}
	});
};

Alipay.create = function create(options) {
	return new Alipay(options);
};


module.exports = Alipay;
    



