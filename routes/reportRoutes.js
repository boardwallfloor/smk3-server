const express = require('express')
const router = express.Router();

const reports_controller = require('../controllers/Reports.js');
const email_controller = require('../controllers/Emails');

router.use(reports_controller.set_header)
router.get('/:id', reports_controller.show_one);
router.put('/:id', reports_controller.update);
router.delete('/:id', reports_controller.delete);

module.exports = router;