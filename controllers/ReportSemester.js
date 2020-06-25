const async = require('async');
const debug = require('debug')('reportsemester');
const { body, validationResult } = require('express-validator');

const Report = require('../models/report_semester')

exports.set_header = (req, res, next) =>{
		Report.countDocuments().exec((err, results) => {
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
		
		
		Report.find(filter).sort(sort).skip(start).limit(limitation).exec(
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

exports.create = [
	body('author').trim().isLength({min:1}),
	body('month').isLength({min:1}),

	(req, res, next) => {
		const error = validationResult(req)
		debug(error)
		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			
				const report = new Report({
					author: req.body.author,
					month: req.body.month,
					year: req.body.year,
					report: {
						question1: {
							total: req.body.report.question1.total,
							detail: req.body.report.question1.detail,
						},
						question2: {
							total: req.body.report.question2.total,
							detail: req.body.report.question2.detail,
						},
						question3: {
							total: req.body.report.question3.total,
							detail: req.body.report.question3.detail,
						},
						question4: {
							total: req.body.report.question4.total,
							detail: req.body.report.question4.detail,
						},
						question5: {
							total: req.body.report.question5.total,
							detail: req.body.report.question5.detail,
						},
						question6: {
							total: req.body.report.question6.total,
							detail: req.body.report.question6.detail,
						},
						question7: {
							total: req.body.report.question7.total,
							detail: req.body.report.question7.detail,
						},
						question8: {
							total: req.body.report.question8.total,
							detail: req.body.report.question8.detail,
						},
					}
				})
				// debug(report)
				Report.create(report, (err, results) =>{
					if(err){return next(err);}
					debug(results)
					res.send("Successfully created per Semester Report");
				})
		}
	}
]

exports.update = [
	body('author').trim().isLength({min:1}),
	body('month').isLength({min:1}),

	(req, res, next) => {
		const error = validationResult(req)
		debug(error)
		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			
				const report = new Report({
					_id: req.params.id,
					author: req.body.author,
					month: req.body.month,
					year: req.body.year,
					report: {
						question1: {
							total: req.body.report.question1.total,
							detail: req.body.report.question1.detail,
						},
						question2: {
							total: req.body.report.question2.total,
							detail: req.body.report.question2.detail,
						},
						question3: {
							total: req.body.report.question3.total,
							detail: req.body.report.question3.detail,
						},
						question4: {
							total: req.body.report.question4.total,
							detail: req.body.report.question4.detail,
						},
						question5: {
							total: req.body.report.question5.total,
							detail: req.body.report.question5.detail,
						},
						question6: {
							total: req.body.report.question6.total,
							detail: req.body.report.question6.detail,
						},
						question7: {
							total: req.body.report.question7.total,
							detail: req.body.report.question7.detail,
						},
						question8: {
							total: req.body.report.question8.total,
							detail: req.body.report.question8.detail,
						},
					}
				})
				// debug(report)
				Report.findByIdAndUpdate(req.params.id, report, (err, results) =>{
					if(err){return (next(err));}
					debug(results)
					res.send("Successfully updated per Semester Report");
				})
		}
	}	
]

exports.delete = (req, res, next) => {
	Report.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		res.send("Sucessfully deleted per Semester Report");
	})
}




