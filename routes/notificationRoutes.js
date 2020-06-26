var express = require('express');
var router = express.Router();

// const cronController = require('../config/CronJob');
// const emailController = require('../controllers/Emails');
const notification_controller = require('../controllers/Notifications')

// router.get('/', cronController.startSchedule);
// router.get('/send', emailController.sendEmail);

router.use(notification_controller.set_header)
router.get('/', notification_controller.show_all);
router.post('/', notification_controller.create);
router.get('/:id', notification_controller.show_one);
router.put('/:id', notification_controller.update);
router.delete('/:id', notification_controller.delete);

router.get('/set/:id', notification_controller.setCompletionToTrue);

module.exports = router;