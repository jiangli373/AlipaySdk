/**
 * Created by li.jiang on 16/8/3.
 * 715015723@qq.com
 */


var Alipay = require('./index');
var config = require('./alipay_config');

module.exports = Alipay.create(config);