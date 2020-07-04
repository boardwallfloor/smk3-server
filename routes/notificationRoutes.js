var express = require('express');
var router = express.Router();

const notification_controller = require('../controllers/Notifications')
// const cron_controller = require('../config/CronJob')
// router.get('/test', cron_controller.startSchedule);

router.use(notification_controller.set_header)
router.get('/', notification_controller.show_all);
router.post('/', notification_controller.create);
//Dashboard Only
router.get('/db', notification_controller.show_ten);

router.get('/:id', notification_controller.show_one);
router.put('/:id', notification_controller.update);
router.delete('/:id', notification_controller.delete);



module.exports = router;