## 支付支付相关接口

参考的是这个项目

    https://github.com/lodengo/alipay

研究了下他的代码，他应该是参考了支付宝提供的php版本的demo

这个项目已经最后一次更新已经是两年前了，然后运行的时候有问题，后来就在他的基础参考支付宝提供的最新版的php版本提炼出来的，修改了一些bug


目前只是集成了

1.即时到帐的接口

2.支付宝快捷登录

3.支付宝手机支付

接入即时到帐需要先在支付宝进行签约，签约成功以后才能使用这个接口


即时到账文档说明：https://doc.open.alipay.com/doc2/detail.htm?spm=a219a.7629140.0.0.6fcylX&treeId=62&articleId=104743&docType=1


运行步骤：

1.git clone https://github.com/jiangli373/AlipaySdk

2.npm install 

3.cp alipay_config.default.js alipay_config.js

4.修改alipay_config.js 添加相关信息：

    var config = {
        partner:'' //合作身份者id，以2088开头的16位纯数字
        ,key:''//安全检验码，以数字和字母组成的32位字符
        ,seller_email:'' //卖家支付宝帐户 必填
        ,host:'http://localhost:3000/'
    	,cacert:'cacert.pem'//ca证书路径地址，用于curl中ssl校验
    	,transport:'http' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    	,input_charset:'utf-8'//字符编码格式 目前支持 gbk 或 utf-8
    	,is_anti_phishing_key:false //是否防止钓鱼  登录使用   如果已申请开通防钓鱼时间戳验证，这里需要设置为true
    };
    

项目说明：

app.js 中 require('./useAlipay').route(app); # 设置了支付宝通知路由


useAlipay.js包装了下Alipay对象，可以在工程中调用

