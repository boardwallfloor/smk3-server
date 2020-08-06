const async = require('async');
const debug = require('debug')('reportsemester');
const { body, validationResult } = require('express-validator');

const Report = require('../models/report_semester')

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

exports.set_header = (req, res, next) =>{
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

exports.show_ten = async (req, res, next) => {
	let filter={};
	debug(req.query)

	if(req.query.filter != undefined){
		filter = await handleFilter(req.query.filter);
	}			
	async.parallel({
		data: (callback) => {
			Report.find(filter).populate('author').sort('year +1').limit(10).exec(callback)
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

const addEmptyFilePropertyToBody = (body) => {
	const input = body
	debug('Body')
	debug(body)
	if(input.question1.file == undefined){
		input.question1.file = {}
		// input.question1.file.src = '';
		// input.question1.file.title = '';
	}
	if(input.question2.file == undefined){
		input.question2.file = {}
		// input.question2.file.src = '';
		// input.question2.file.title = '';
	}
	if(input.question3.file == undefined){
		input.question3.file = {}
		// input.question3.file.src = '';
		// input.question3.file.title = '';
	}
	if(input.question4.file == undefined){
		input.question4.file = {}
		// input.question4.file.src = '';
		// input.question4.file.title = '';
	}
	if(input.question5.file == undefined){
		input.question5.file = {}
		// input.question5.file.src = '';
		// input.question5.file.title = '';
	}
	if(input.question6.file == undefined){
		input.question6.file = {}
		// input.question6.file.src = '';
		// input.question6.file.title = '';
	}
	if(input.question7.file == undefined){
		input.question7.file = {}
		// input.question7.file.src = '';
		// input.question7.file.title = '';
	}
	if(input.question8.file == undefined){
		input.question8.file = {}
		// input.question8.file.src = '';
		// input.question8.file.title = '';
	}
	debug('input %O',input)
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
				// debug(report)
				Report.create(report, (err, results) =>{
					if(err){return next(err);}
					debug('results')
					debug(results)
					res.json(results);
				})
		}
	}
]

exports.update = [
	body('author').trim().isLength({min:1}),
	body('month').isLength({min:1}),

	async (req, res, next) => {
		const error = validationResult(req)
		debug(error)
		if(!error.isEmpty()){
			throw new Error("Error : ");
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


