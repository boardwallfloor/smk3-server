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

exports.show_all = (req, res, next) => {
	debug(Object.keys(req.query).length)
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
		debug(req.query);
		let filter={};
		let range={}, start, end, limitation;
		let sort={}, orderLowerCase, sortOn={};
		if(req.query.filter != undefined){
		filter = JSON.parse(req.query.filter)
		}
		if(req.query.range != undefined){
		range = JSON.parse(req.query.range)
		[start, end] = range;
		}
		if(req.query.sort != undefined) {
		sort = JSON.parse(req.query.sort)
		debug(sort);
		const [resource, order] = sort;
		orderLowerCase = order.toLowerCase()
		sortOn={
			[resource]: [orderLowerCase]
		}
		}
		// debug(start, end)
		
		Notification.find(filter).sort(sortOn).skip(start).limit(end-start+1).exec(
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
			Notification.create(notification, (err, results) =>{
				if(err){return next(err);}
				debug(results)
				Notification.findById(results._id).populate('remindee').exec(async (err, results) => {
				await cronjob.startSchedule(results);
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

exports.setCompletionToTrue = [
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
				complete_status: true,
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

exports.delete = (req, res, next) => {
	Notification.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		// res.status(200).send("Sucessfully deleted Notification");
		res.json(results);
	})
}
