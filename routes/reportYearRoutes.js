const express = require('express')
const router = express.Router();

const reports_year_controller = require('../controllers/ReportsYear');
const email_controller = require('../controllers/Emails');

router.use(reports_year_controller.set_header)
//Restful
router.get('/db', reports_year_controller.show_ten);

router.get('/export/:id', reports_year_controller.export);
router.get('/exportall', reports_year_controller.exportall);

router.get('/', reports_year_controller.show_all);
router.post('/', reports_year_controller.create);
router.get('/unverifiedreport', reports_year_controller.unverifiedReports);


router.get('/:id', reports_year_controller.show_one);
router.put('/:id', reports_year_controller.update);
router.delete('/:id', reports_year_controller.delete);


module.exports = router;