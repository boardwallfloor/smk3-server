const express = require('express')
const router = express.Router();

const reports_semester_controller = require('../controllers/ReportSemester');
const email_controller = require('../controllers/Emails');


//Semester Report
router.use(reports_semester_controller.set_header)
router.get('/', reports_semester_controller.show_all);
router.post('/', reports_semester_controller.create);

//TEST
// router.get('/test', reports_semester_controller.test);
// router.get('/xcl', reports_semester_controller.send_data_excel);

//Restful
router.get('/db', reports_semester_controller.show_ten);
router.get('/send/:id', reports_semester_controller.send_data);


router.get('/:id', reports_semester_controller.show_one);
router.put('/:id', reports_semester_controller.update);
router.delete('/:id', reports_semester_controller.delete);


module.exports = router;