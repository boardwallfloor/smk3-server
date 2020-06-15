var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/Users');

router.use(user_controller.set_header)
router.get('/', user_controller.show_all);
router.get('/:id', user_controller.show_one);
router.put('/:id', user_controller.update);
router.delete('/:id', user_controller.delete);

module.exports = router;