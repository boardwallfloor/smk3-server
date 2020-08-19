const async = require('async')
const debug = require('debug')('chart')

const yearReport = require('../models/report_year')
const semesterReport = require('../models/report_semester')
const Institution = require('../models/institution.js')

exports.get_ten = async (req, res, next) => {
	let data = []
	const institutions = await Institution.find({},'name').limit(5).exec()
	const findYearReportCount = async () => {
		let count = [];
		for(let _a = 0; _a < institutions.length; _a++){
			const yearCount = await yearReport.find({institution:institutions[_a]._id}).countDocuments().exec()
			debug(yearCount)
			count.push(yearCount)
		}
		return count
	}
	const findSemesterReportCount = async () => {
		let count = [];
		for(let _a = 0; _a < institutions.length; _a++){
			const semesterCount = await semesterReport.find({institution:institutions[_a]._id}).countDocuments().exec()
			debug(semesterCount)
			count.push(semesterCount)
		}
		return count
	}
	const YearCount = await findYearReportCount()
	const SemesterCount = await findSemesterReportCount()
	
	for(let _a = 0; _a < institutions.length; _a++){
		
		const pushedData = {
			Fasyankes: institutions[_a].name,
			Tahun: YearCount[_a],
			Semester: SemesterCount[_a],
			Total: YearCount[_a] + SemesterCount[_a]
		}
		data.push(pushedData)
	}
	const jsonForm = {data}
	debug(jsonForm)
	res.json(jsonForm)
}