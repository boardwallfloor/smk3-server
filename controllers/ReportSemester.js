const async = require('async');
const debug = require('debug')('reportsemester');
const { body, validationResult } = require('express-validator');

const Report = require('../models/report_semester')
const Notification = require('../models/notification');
const User = require('../models/user');
const exportFile = require('../config/generateExcel/generateExcel')

const handleFilter = (filter) => {
		const filterJson = JSON.parse(filter)
		return filterJson;
	}

const handleRange = (range) => {
	const rangeJson = JSON.parse(range)
	const [start, end] = rangeJson;
	const limitation = end-start+1;
	return [start,limitation];
}

const handleSort = (sort) => {
	const sortJson = JSON.parse(sort)
	const [resource, order] = sortJson;
	const orderLowerCase = order.toLowerCase()
	return sortOn={
		[resource]: [orderLowerCase]
	}
}

const checkIfReminderExist = (author, date) => {
	debug('date in ifCheckreminder : %O', date)
	let inputMonthMin, inputMonthMax
	
	let inputDate = new Date(date)
	debug('inputDate : %O',inputDate)
	let inputMonth = inputDate.getMonth()
	let inputYear = inputDate.getFullYear()

	if(inputMonth < 6){
		inputMonthMin = 1
		inputMonthMax = 5
	}else if (inputMonth >= 6){
		inputMonthMin = 6
		inputMonthMax = 12
	}

	debug('inputMonthMax :  %O',inputMonthMax)
	debug('inputMonthMin :  %O', inputMonthMin)
	debug('inputYear :  %O', inputYear)
	debug(`Notification.findOne({ remind_date: { $gte: ${inputYear}-${inputMonthMin}-01, $lte: ${inputYear}-${inputMonthMax}-31 }, remindee: ${author}, report_type : 'semesterly' })`)
	return Notification.findOne({ remind_date: { $gte: `${inputYear}-${inputMonthMin}-01`, $lte: `${inputYear}-${inputMonthMax}-31` }, remindee: author, report_type : 'semesterly' })
}

exports.set_header = (req, res, next) => {
	Report.countDocuments().exec((err, results) => {
	res.set('Content-Range', results);
	next();
	})
}


exports.show_all = async (req, res, next) => {

	debug(Object.keys(req.query).length)

	if(Object.keys(req.query).length === 0){
		debug("No query")
		Report.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			// debug(results);
			res.json(results);
		}
		)	

	}else{
		debug("Query :");
		debug(req.query)
		let filter;
		let start, limitation;
		let sort;
		const select = req.query.select

		if(req.query.range != undefined){
			const range  = await handleRange(req.query.range);
			[start, limitation] = range;
		}

		if(req.query.filter != undefined){
			filter = await handleFilter(req.query.filter);
		}

		if(req.query.sort != undefined) {
			sort = handleSort(req.query.sort);
		}
		
		
		Report.find(filter).select(select).sort(sort).skip(start).limit(limitation).exec(
			(err, results) =>{
				res.json(results)
			})
	}
}

exports.show_one = (req, res, next) => {
	Report.findById(req.params.id).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results);
			res.json(results);
		}
		)
}

exports.show_ten = async (req, res, next) => {
	let filter={};
	debug(req.query)

	if(req.query.filter != undefined){
		filter = await handleFilter(req.query.filter);
	}			
	async.parallel({
		data: (callback) => {
			Report.find(filter).populate('author').populate('institution').sort({'date':'desc'}).limit(10).exec(callback)
		},
		count: (callback) => {
			Report.countDocuments(filter).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		debug(results)
		res.json(results);
	})
}

const addEmptyFilePropertyToBody = (input) => {
	const questionList = ['question1','question2','question3','question4','question5','question6','question7','question8']
	for(let _a = 0; _a < questionList.length; _a++){
		if(!input[questionList[_a]]){
			input[questionList[_a]] = {}
		}
		// debug(`input.${questionList[_a]}`)
		if(!input[questionList[_a]].file){
			input[questionList[_a]].file = {}
		}
	}
	// debug(input)
	return input;
}

exports.create = [
	body('author').trim().isLength({min:1}),

	async (req, res, next) => {
		debug('Body : ')
		debug(req.body)
		const error = validationResult(req)
		if(!error.isEmpty()){
			debug(error)
			throw new Error();
		}else{

			const newFileInput = await addEmptyFilePropertyToBody(req.body.report)
			// const newFileInput = req.body.report
			debug('New File Input : %O',newFileInput)
			debug('Date: %O',req.body.date)
			const report = new Report({
				author: req.body.author,
				date: req.body.date,
				institution: req.body.institution,
				validated: req.body.validated,
				report: {
					question1: {
						total: newFileInput.question1.total,
						detail: newFileInput.question1.detail,
						file: {
							src: newFileInput.question1.file.src,
							title: newFileInput.question1.file.title
						}
					},
					question2: {
						total: newFileInput.question2.total,
						detail: newFileInput.question2.detail,
						file: {
							src: newFileInput.question2.file.src,	
							title: newFileInput.question2.file.title
						}
					},
					question3: {
						total: newFileInput.question3.total,
						detail: newFileInput.question3.detail,
						file: {
							src: newFileInput.question3.file.src,	
							title: newFileInput.question3.file.title
						}
					},
					question4: {
						total: newFileInput.question4.total,
						detail: newFileInput.question4.detail,
						file: {
							src: newFileInput.question4.file.src,	
							title: newFileInput.question4.file.title
						}
					},
					question5: {
						total: newFileInput.question5.total,
						detail: newFileInput.question5.detail,
						file: {
							src: newFileInput.question5.file.src,	
							title: newFileInput.question5.file.title
						}
					},
					question6: {
						total: newFileInput.question6.total,
						detail: newFileInput.question6.detail,
						file: {
							src: newFileInput.question6.file.src,	
							title: newFileInput.question6.file.title
						}
					},
					question7: {
						total: newFileInput.question7.total,
						detail: newFileInput.question7.detail,
						file: {
							src: newFileInput.question7.file.src,	
							title: newFileInput.question7.file.title
						}
					},
					question8: {
						total: newFileInput.question8.total,
						detail: newFileInput.question8.detail,
						file: {
							src: newFileInput.question8.file.src,	
							title: newFileInput.question8.file.title
						}
					},
				}
			})
				Report.create(report, async (err, results) =>{
					if(err){return next(err);}
					const reminderStatusQuery = await checkIfReminderExist(req.body.author, req.body.date)
					debug(reminderStatusQuery)
					if(reminderStatusQuery){
						debug(reminderStatusQuery.notification_status )
						reminderStatusQuery.notification_status = 'Laporan Dibuat'
						debug('Reminder status changed')
						await reminderStatusQuery.save()
					}
					debug('Data created')
					debug('Result : ')
					debug(results)
					res.json(results);
				})
		}
	}
]

exports.update = [
	body('author').trim().isLength({min:1}),

	async (req, res, next) => {
		const error = validationResult(req)
		debug('Input date : %o', req.body.date)
		debug(error)
		if(!error.isEmpty()){
			throw new Error("Error : ")
		}else{
			const newFileInput = await addEmptyFilePropertyToBody(req.body.report)
			// const newFileInput = req.body.report
			debug('New File Input : %O',newFileInput)
			const report = new Report({
				_id : req.params.id,
				author: req.body.author,
				dates: req.body.dates,
				institution: req.body.institution,
				validated: req.body.validated,
				report: {
					question1: {
						total: newFileInput.question1.total,
						detail: newFileInput.question1.detail,
						src: newFileInput.question1.file.src,
						title: newFileInput.question1.file.title

					},
					question2: {
						total: newFileInput.question2.total,
						detail: newFileInput.question2.detail,
						src: newFileInput.question2.file.src,
						title: newFileInput.question2.file.title

					},
					question3: {
						total: newFileInput.question3.total,
						detail: newFileInput.question3.detail,
						src: newFileInput.question3.file.src,
						title: newFileInput.question3.file.title

					},
					question4: {
						total: newFileInput.question4.total,
						detail: newFileInput.question4.detail,
						src: newFileInput.question4.file.src,
						title: newFileInput.question4.file.title

					},
					question5: {
						total: newFileInput.question5.total,
						detail: newFileInput.question5.detail,
						src: newFileInput.question5.file.src,
						title: newFileInput.question5.file.title

					},
					question6: {
						total: newFileInput.question6.total,
						detail: newFileInput.question6.detail,
						src: newFileInput.question6.file.src,
						title: newFileInput.question6.file.title

					},
					question7: {
						total: newFileInput.question7.total,
						detail: newFileInput.question7.detail,
						src: newFileInput.question7.file.src,
						title: newFileInput.question7.file.title

					},
					question8: {
						total: newFileInput.question8.total,
						detail: newFileInput.question8.detail,
						src: newFileInput.question8.file.src,
						title: newFileInput.question8.file.title

					},
				}
			})
				// debug(report)
				Report.findByIdAndUpdate(req.params.id, report, (err, results) =>{
					if(err){return (next(err));}
					debug(results)
					res.json(results);
				})
		}
	}	
]

exports.delete = (req, res, next) => {
	Report.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		res.json(results);
	})
}


exports.download = (req, res, next) => {
	Report.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		res.json(results);
	})
}


exports.export =  (req, res, next) => {
	let excludedFileList = '';
	const questionList = ['question1','question2','question3','question4','question5','question6','question7','question8']
	for(let a = 0; a < questionList.length; a++){
		excludedFileList += '-report.' + questionList[a] + '.file'
		if(a != questionList.length){
			excludedFileList += ' '
		}
	}
	debug(excludedFileList)
	debug(req.params)
	Report.findById(req.params.id).select(excludedFileList).populate('institution','name').populate('author','full_name').exec(
		async (err, results) =>{
			if(err){return next(err);}
			debug(results);
			debug('Generating file')
			await exportFile.reportSemesterToExcel(results, res)
		}
		)
}


exports.exportall =  async(req, res, next) => {
	let excludedFileList = '';
	const questionList = ['question1','question2','question3','question4','question5','question6','question7','question8']
	for(let a = 0; a < questionList.length; a++){
		excludedFileList += '-report.' + questionList[a] + '.file'
		if(a != questionList.length){
			excludedFileList += ' '
		}
	}
	// debug(excludedFileList)
	debug("Query : %O",req.query);
	let filter;

	if(req.query.filter !== undefined){
		//handle date, institution
		filter = await handleFilter(req.query.filter)
		debug("filter in Json : %o",filter)
		if(filter.hasOwnProperty('username')){
		debug("Query username : %o",filter.username)
			const results = await User.find({username: filter.username}).select("_id").exec()
			debug("User id : %o",results)
			filter.author = results[0]._id
			delete filter.username
		}
		if(filter.hasOwnProperty('date')){
			debug("Input Date : %o",filter.date)
			const [queryDateStart, queryDateEnd] = filter.date
			let inputMonthMin, inputMonthMax
			
			dateStart = new Date(queryDateStart)
			dateEnd = new Date(queryDateEnd)

			debug('dateStart : %o',dateStart)
			debug('dateEnd : %o',dateEnd)

			const dateStartObject = {
				year: dateStart.getFullYear(),
				month: dateStart.getMonth(),
				date: dateStart.getDay()
			}
			const dateEndObject = {
				year: dateEnd.getFullYear(),
				month: dateEnd.getMonth(),
				date: dateEnd.getDay()
			}

			debug("dateStartObject : %o",dateStartObject)
			debug("dateEndObject : %o",dateEndObject)
			filter.date = { $gte: `${dateStartObject.year}-${dateStartObject.month}-${dateStartObject.date}`, $lte: `${dateEndObject.year}-${dateEndObject.month}-${dateEndObject.date}` }
		}
		if(filter.hasOwnProperty('institution')){
			
		}
	}
	debug("Filter used : %o",filter)
	Report.find(filter).select(excludedFileList).populate('institution','name').populate('author','full_name').exec(
		async (err, results) =>{
			if(err){return next(err);}
			debug(results);
			debug('Generating file')
			await exportFile.reportsSemesterAllToExcel(results, res, results.length)
			// res.json(results)
		}
	)

	
}