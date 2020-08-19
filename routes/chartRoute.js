var express = require('express');
var router = express.Router();
const chart_controller = require('../controllers/Chart')

router.get('/', chart_controller.get_ten)

module.exports = router