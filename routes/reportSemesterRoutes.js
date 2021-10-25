const express = require('express')
const router = express.Router()

const reportSemester = require('../controllers/ReportSemester')

// Semester Report
router.use(reportSemester.set_header)
router.get('/', reportSemester.show_all)
router.post('/', reportSemester.create)

// Restful
router.get('/db', reportSemester.show_ten)
router.get('/export/:id', reportSemester.export)
router.get('/exportall', reportSemester.exportall)

router.get('/:id', reportSemester.show_one)
router.put('/:id', reportSemester.update)
router.delete('/:id', reportSemester.delete)

module.exports = router
