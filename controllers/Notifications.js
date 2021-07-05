const async = require('async')
const debug = require('debug')('notif')
const { body, validationResult } = require('express-validator');
const moment = require('moment')

const cronjob = require('../config/CronJob')
const Notification = require('../models/notification');
const reportYear = require('../models/report_year');
const reportSemester = require('../models/report_semester');
const exportFile = require('../config/generateExcel/generateExcel')
const User = require('../models/user')

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

const dateToYear = (date) => {
	return moment(date).format('YYYY')
}

const dateToSemester = (date) => {
	const dateToMonthIndex = moment(date).format('M')
	return dateToMonthIndex < 6 ? 'Ganjil' : 'Genap'
}

const findReportYearQuery = (inputDate, inputRemindee) => {
	return reportYear.findOne({ year: { $gte: `${inputDate}-00-01`, $lte: `${inputDate}-12-31` }, author: inputRemindee })
}

const findReportSemesterQuery = (inputYear, inputMonth, inputRemindee) => {
	let inputMonthMin, inputMonthMax
	if(inputMonth < 7){
		inputMonthMin = 1;
		inputMonthMax = 6;
	}else if (inputMonth >= 7){
		inputMonthMin = 7
		inputMonthMax = 12
	}
	debug('inputMonthMax :  %O',inputMonthMax)
	debug('inputMonthMin :  %O', inputMonthMin)
	debug('inputYear :  %O', inputYear)
	return reportSemester.findOne({ date: { $gte: `${inputYear}-${inputMonthMin}-01`, $lte: `${inputYear}-${inputMonthMax}-31` }, author: inputRemindee })
}

const checkDateIfPast = (date) =>{
	const currentDate = new Date()
	debug("Checking Year")
	if(currentDate.getFullYear() < date.getFullYear()){
		return false
	}
	debug("Checking Month")
	if(currentDate.getMonth() < date.getMonth()){
		return false
	}
	debug("Checking Days")
	if(currentDate.getDay() < date.getDay()){
		return false
	}
	return true
}


exports.set_header = (req, res, next) =>{
	Notification.countDocuments().exec((err, results) => {
	res.set('Content-Range', results);
	next();
	})
}

exports.show_all = async (req, res, next) => {

	debug(Object.keys(req.query).length)
	if(Object.keys(req.query).length === 0){
		debug("No query")
		Notification.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			// debug(results);
			res.json(results)
		}
		)	

	}else{
		debug("Query :");
		debug(req.query)
		let filter
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
			debug("Sort : %o",req.query.sort)
			sort = handleSort(req.query.sort);
		 	debug(sort)
		}

		Notification.find(filter).select(select).sort(sort).skip(start).limit(limitation).exec(
			(err, results) =>{
				res.json(results)
			})
	}

}

exports.show_one = (req, res, next) => {
	Notification.findById(req.params.id).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results);
			debug(dateToYear(results.remind_date))
			debug(dateToSemester(results.remind_date))
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
			Notification.find(filter).sort({'remind_date':'desc'}).limit(10).exec(callback)
		},
		count: (callback) => {
			Notification.countDocuments(filter).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		debug(results)
		res.json(results);
	})
}

exports.count = async (req, res, next) => {
	let filter={};
	debug(req.query)

	if(req.query.filter != undefined){
		filter = await handleFilter(req.query.filter);
	}			
	async.parallel({
		data: (callback) => {
			Notification.find(filter).sort({'remind_date':'desc'}).exec(callback)
		},
		count: (callback) => {
			Notification.countDocuments(filter).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		debug(results)
		res.json(results);
	})
}

exports.create = [
	body('remindee'),
	body('remind_date').toDate().optional({ checkFalsy: true }).isISO8601(),
	body('report_type'),
	
	async (req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			debug(error)
			throw new Error();
		}else{
			debug(req.body.remind_date)
			let isReportExist = false;
			let isDateValid = true;
			const inputDateYear = req.body.remind_date.getFullYear()
			const inputDateMonth = req.body.remind_date.getMonth()
			const inputRemindee = req.body.remindee
			const dateExpirationStatus = await checkDateIfPast(req.body.remind_date)
			debug("dateExpirationStatus : %o", dateExpirationStatus)
			if(dateExpirationStatus){
				isDateValid = false
				res.status(400).json({
				   message: 'Target date is invalid / out of date',
				});
			}
			if(isDateValid){
				if(req.body.report_type === 'yearly'){
					const result = await findReportYearQuery(inputDateYear, inputRemindee)
					debug('Data query result %O',result)
					if(result){
						isReportExist = true
					}
				}
				if(req.body.report_type === 'semesterly'){
					const result = await findReportSemesterQuery( inputDateYear, inputDateMonth, inputRemindee)
					debug('Data query result %O',result)
					if(result){
						isReportExist = true
					}
				}
				debug('Exist status %O',isReportExist)
				if(isReportExist){
					res.status(400).send({
					   message: 'Data already exist',
					});
				}
				if(!isReportExist){
					debug('Report not found, creating reminder')
					
					const userInstitutionId = await User.findById(req.body.remindee).select('user_institution').exec()
					debug("Institution ID : %o",userInstitutionId)
					const notification = new Notification({
						notification_status: req.body.notification_status,
						remindee: req.body.remindee,
						remind_date: req.body.remind_date,
						report_type: req.body.report_type,
						institution: userInstitutionId.user_institution
					})
					// debug(institution);
					Notification.create(notification, async (err, results) =>{
						if(err){return next(err);}
						// debug("Notification created and saved")
						// debug(results)
						Notification.findById(results._id).populate('remindee').exec(async (err, data) => {
							if(err){return next(err);}
							debug('Data : %O', data);
							// debug('Results : %O', results);
							await cronjob.startSchedule(data);
						})
						res.send(results);
					})
				}
			}
		}
	}

]

exports.update = [
	body('notification_status'),
	body('remindee'),
	body('remind_date').toDate().optional({ checkFalsy: true }).isISO8601(),
	body('report_type'),
	
	async (req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			const userInstitutionId = await User.findById(req.body.remindee).select('user_institution').exec()
			const notification = new Notification({
				_id : req.params.id,
				notification_status: req.body.notification_status,
				remindee: req.body.remindee,
				remind_date: req.body.remind_date,
				report_type: req.body.report_type,
				institution: userInstitutionId.user_institution
			})
			// debug(report)
			Notification.findByIdAndUpdate(req.params.id, notification, (err, results) =>{
				if(err){return (next(err));}
				debug(results)
				res.send(results);
			})
		}
	}

]

exports.setCompletionToTrue = (req, res, next) => {
			debug(req)
			Notification.findById(req).exec(async (err, results) => {
			results.notification_status = 'Peringatan Dikirim'
			await results.save()
;			debug('Results from notif setToTrue : %O',results)

			})
		}
	

exports.delete = (req, res, next) => {
	Notification.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		// res.status(200).send("Sucessfully deleted Notification");
		res.json(results);
	})
}


exports.export = (req, res, next) => {

	Notification.findById(req.params.id).populate('remindee','full_name').exec(
		async (err, results) =>{
			if(err){return next(err);}
			debug(results);
			debug('Generating file')
			await exportFile.notificationToExcel(results, res)
			// res.json(results)
		}
		)
}

exports.exportall = async(req, res, next) => {
	filter = await handleFilter(req.query.filter)
	debug("filter in Json : %o",filter)

	Notification.find().populate('remindee','full_name').exec(
		async (err, results) =>{
			if(err){return next(err);}
			debug(results);
			debug('Generating file')
			await exportFile.notificationAllToExcel(results, res, results.length)
			// res.json(results)
		}
		)
}