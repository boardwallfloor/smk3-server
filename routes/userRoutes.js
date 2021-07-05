var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/Users');

router.get('/cookie', user_controller.sendCookie)
router.use(user_controller.set_header)
router.get('/db', user_controller.show_ten);
router.get('/', user_controller.show_all);
router.post('/', user_controller.create);
router.get('/:id', user_controller.show_one);
router.put('/:id', user_controller.update);
router.delete('/:id', user_controller.delete);

module.exports = router;