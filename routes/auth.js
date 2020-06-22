var express = require('express');
var router = express.Router();
// const passport = require('passport');
const user_controller = require('../controllers/Users');


router.post('/register', user_controller.create);
router.post('/login', user_controller.login,user_controller.setUser,function(req, res) {
	res.json(req.user);
  });




module.exports = router;