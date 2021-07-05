var express = require('express');
var router = express.Router();
const debug = require('debug')('authroutes')

require('dotenv').config();


const user_controller = require('../controllers/Users');


/* POST login. */
router.post('/login', user_controller.login);
router.post('/authenticated', user_controller.checkAuth)

// router.post('/test', user_controller.testAuthCheck)
// router.post('/login', user_controller.login);
module.exports = router;