const async = require('async')
const debug = require('debug')('notif')
const { body, validationResult } = require('express-validator');

const Notification = require('../models/notification');
const cronjob = require('../config/CronJob')


exports.set_header = (req, res, next) =>{
		Notification.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}

exports.show_all = async (req, res, next) => {

	debug(Object.keys(req.query).length)

	const handleRange = () => {
		const range = JSON.parse(req.query.range)
		const [start, end] = range;
		const limitation = end-start+1;
		return [start,limitation];
	}

	const handleSort = () => {
		const sort = JSON.parse(req.query.sort)
		const [resource, order] = sort;
		const orderLowerCase = order.toLowerCase()
		return sortOn={
			[resource]: [orderLowerCase]
		}
	}

	const handleFilter = () => {
		const filter = JSON.parse(req.query.filter)
		return filter;
	}
	if(Object.keys(req.query).length === 0){
		debug("No query")
		Notification.find({}).exec(
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

		if(req.query.range != undefined){
			const range  = await handleRange();
			[start, limitation] = range;
		}

		if(req.query.filter != undefined){
			filter = await handleFilter();
		}

		if(req.query.sort != undefined) {
			sort = handleSort();
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
			res.json(results);
		}
		)
}

exports.show_ten = (req, res, next) => {
	async.parallel({
		data: (callback) => {
			Notification.find({}).sort('year +1').limit(10).exec(callback)
		},
		count: (callback) => {
			Notification.countDocuments({}).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		console.log(results)
		res.json(results);
	})
}

exports.create = [
	body('complete_status'),
	body('remindee'),
	body('remind_date').toDate().optional({ checkFalsy: true }).isISO8601(),
	body('report_type'),
	
	(req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			debug(error)
			throw new Error();
		}else{
			const notification = new Notification({
				complete_status: req.body.complete_status,
				remindee: req.body.remindee,
				remind_date: req.body.remind_date,
				report_type: req.body.report_type,
			})
			// debug(institution);
			Notification.create(notification, async (err, results) =>{
				if(err){return next(err);}
				debug("Notification created and saved")
				debug(results)
				Notification.findById(results._id).populate('remindee').exec(async (err, data) => {
					if(err){return next(err);}
					debug('Data : %O', data);
					debug('Results : %O', results);
					await cronjob.startSchedule(data);
				})
				res.send(results);
			})
		}
	}

]

exports.update = [
	body('complete_status'),
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
				complete_status: req.body.complete_status,
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
			results.complete_status = true
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
	console.log("Sent from Notifications controller")
}