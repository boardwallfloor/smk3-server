var express = require('express');
var router = express.Router();
const institution_controller = require('../controllers/Institution');

router.use(institution_controller.set_header)
router.get('/db', institution_controller.show_ten);
router.get('/', institution_controller.show_all);
router.post('/', institution_controller.create);
router.get('/:id', institution_controller.show_one);
router.put('/:id', institution_controller.update);
router.delete('/:id', institution_controller.delete);

module.exports = router;