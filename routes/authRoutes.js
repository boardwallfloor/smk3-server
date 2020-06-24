var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/Users');

router.post('/register', user_controller.create);
router.post('/login', user_controller.login,function(req, res) {
	console.log(req.user)
	res.json(req.user);
  });
// router.post('/login', user_controller.login);
module.exports = router;