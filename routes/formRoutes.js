var express = require('express');
var router = express.Router();
const form_controller = require('../controllers/Forms');

router.get('/', form_controller.show_all);
router.get('/:id', form_controller.show_one);

module.exports = router;