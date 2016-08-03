var express = require('express');
var router = express.Router();
var AlipayController = require('../controller/AlipayController');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
	res.render('login', { title: 'Express' });
});

router.post('/create_direct_pay_by_user',AlipayController.create_direct_pay_by_user);
router.post('/user_auth_quick_login',AlipayController.user_auth_quick_login);



module.exports = router;
