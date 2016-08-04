var config = {
    partner:'' //合作身份者id，以2088开头的16位纯数字
    ,key:''//安全检验码，以数字和字母组成的32位字符
	,seller_id:'' //卖家支付宝用户号 以2088开头的纯16位数字 也就是partner
    ,seller_email:'' //卖家支付宝帐户 必填
    ,host:'http://localhost:3000/'
	,cacert:'cacert.pem'//ca证书路径地址，用于curl中ssl校验
	,transport:'http' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
	,input_charset:'utf-8'//字符编码格式 目前支持 gbk 或 utf-8
	,is_anti_phishing_key:false //是否防止钓鱼  登录使用   如果已申请开通防钓鱼时间戳验证，这里需要设置为true
};


module.exports = config;