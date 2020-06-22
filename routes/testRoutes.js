const express = require('express')
const router = express.Router();

const test_controller = require('../controllers/testControllers');
const email_controller = require('../controllers/Emails');

router.use(test_controller.set_header)
router.get('/', test_controller.show_all);
router.get('/pop',test_controller.populate);
router.get('/show',test_controller.show1);
router.get('/formshow',test_controller.singleFormWithDetail);
router.get('/aggregate',test_controller.showAggregate);
router.get('/create',test_controller.create);
router.get('/indexof',test_controller.indexof);
router.get('/showpop',test_controller.findAndPopulate);
router.get('/test',test_controller.test);

router.get('/email', email_controller.sendEmail);

module.exports = router;