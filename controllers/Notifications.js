const async = require('async')
const debug = require('debug')('notif')
const { body, validationResult } = require('express-validator');
const moment = require('moment')

const Notification = require('../models/notification');
const reportYear = require('../models/report_year');
const reportSemester = require('../models/report_semester');
const cronjob = require('../config/CronJob')

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

const findReportYear = (inputDate, inputRemindee) => {
	return reportYear.findOne({ year: { $gte: `${inputDate}-01-01`, $lte: `${inputDate}-12-30` }, author: inputRemindee })
		// .exec(
		// (err,results) => {
		// 	// if(err){return next(err)}
		// 	return results;
		// })
}

const checkReportAlreadyExist = async (inputDate, inputRemindee, reportType) => {
	debug(inputDate.getFullYear())
	debug(inputRemindee)
	debug(reportType)
	let existStatus = '';
	if(reportType === 'yearly'){
		// reportYear.find({ year: { $gte: `${inputDate.getFullYear()}-01-01`, $lte: `${inputDate.getFullYear()}-12-30` }, author: inputRemindee }).exec((err, results) => {
		// 	if(err){return next(err)}
		// 	// debug('Result from check %O',results)
		// 	results ? existStatus='true' : existStatus='false'
		// 	return existStatus
		// })
		const status = await findReportYear(inputDate, inputRemindee)
		debug(status)
		if(status){
			return true;
		}else {
			return false
		}
		// return status
	}
	if(reportType === 'semesterly'){
		reportSemester.find({ year: { $gte: `${inputDate.getFullYear()}-01-01`, $lte: `${inputDate.getFullYear()}-12-30` }, author: inputRemindee }).exec((err, results) => {
			// debug('Result from check %O',results)
			results ? 'true' : 'false'
		})
	}
	
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
		let filter={};
		let start, limitation;
		let sort;

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

		Notification.find(filter).sort(sort).skip(start).limit(limitation).exec(
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
			Notification.find(filter).sort('year +1').limit(10).exec(callback)
		},
		count: (callback) => {
			Notification.countDocuments(filter).exec(callback)
		},
		test: (callback) => {
			reportYear.find({ year: { $gte: '2020-01-01', $lte: '2020-12-30' }, author: '5f3c27cbbff2e5e0e8182ee1' }).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		debug(results.test)
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
			let isReportExist = false;
			if(req.body.report_type === 'yearly'){
				const inputDate = req.body.remind_date.getFullYear()
				const inputRemindee = req.body.remindee
				// await reportYear.find({ year: { $gte: `${inputDate}-01-01`, $lte: `${inputDate}-12-30` }, author: inputRemindee }).
				// exec( async (err, results) => {
				// 	debug(results)
				// 	if(results.length){
				// 		isReportExist = true
				// 		debug('true')
				// 		}
				// 	}
				// 	)
				const result = await findReportYear(inputDate, inputRemindee)
				debug(result)
				if(result){
					isReportExist = true
				}
				// exec( (err,results) => {
				// 	debug('ceck')
				// 	if(err){return next(err)}
				// 	if(results){
				// 		return isReportExist = true;
				// 		// debug('Found result %O',results)
				// 		// debug('Exist status %O',isReportExist)
				// 		// res.send('Exist')
						
				// 	}
				// })
			}
			debug('Exist status %O',isReportExist)
			if(isReportExist){
				res.json('Data already exist')
			}
			if(!isReportExist){
				const notification = new Notification({
					notification_status: req.body.notification_status,
					remindee: req.body.remindee,
					remind_date: req.body.remind_date,
					report_type: req.body.report_type,
				})
				// debug(institution);
				Notification.create(notification, async (err, results) =>{
					if(err){return next(err);}
					// debug("Notification created and saved")
					// debug(results)
					Notification.findById(results._id).populate('remindee').exec(async (err, data) => {
						if(err){return next(err);}
						debug('Data : %O', data);
						debug('Results : %O', results);
						// await cronjob.startSchedule(data);
					})
					res.send(results);
				})
			}
		}
	}

]

exports.update = [
	body('notification_status'),
	body('remindee'),
	body('remind_date').toDate().optional({ checkFalsy: true }).isISO8601(),
	body('report_type'),
	
	(req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			const notification = new Notification({
				_id: req.params.id,
				notification_status: req.body.notification_status,
				remindee: req.body.remindee,
				remind_date: req.body.remind_date,
				report_type: req.body.report_type,
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

exports.test = () => {
	notification
}