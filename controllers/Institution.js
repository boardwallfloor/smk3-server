const async = require('async')
const debug = require('debug')('institution')
const { body, validationResult } = require('express-validator');
//Test
	
var fs = require('fs');

const Institution = require('../models/institution.js')

exports.set_header = (req, res, next) =>{
		Institution.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}
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

exports.show_all = async(req, res, next) => {
	debug(Object.keys(req.query).length)
	if(Object.keys(req.query).length === 0){
		debug("No query")
		Institution.find({}).exec(
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
		// debug(start, end)
		
		Institution.find(filter).select(select).sort(sort).skip(start).limit(limitation).exec(
			(err, results) =>{
				res.json(results)
			})
	}

}

exports.show_one =  (req, res, next) => {
	Institution.findById(req.params.id).exec(
		async (err, results) =>{
			if(err){return next(err);}
			if(results.file){
				debug('File : ');
				debug(typeof results.file.src);
				debug(results.file.src);
				// split to get data part of mime format
				const file = Buffer.from(results.file.src.split(",")[1], 'base64');
				debug(results.file.title);
				await fs.writeFileSync(__dirname +`/${results.file.title}`,file);
			}
			res.json(results);
		}
		)
}

exports.show_ten = async(req, res, next) => {
	let filter={};
	debug(req.query)

	if(req.query.filter != undefined){
		filter = await handleFilter(req.query.filter);
	}			
	async.parallel({
		data: (callback) => {
			Institution.find(filter).limit(10).exec(callback)
		},
		count: (callback) => {
			Institution.countDocuments(filter).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		debug(results)
		res.json(results);
	})	
}

exports.create = [
	body('name').trim().isLength({min:1}),
	body('address').trim().escape().isLength({min:1}),
	body('city').trim().escape().isLength({min:1}),
	body('province').trim().escape().isLength({min:1}),
	body('file'),
	
	async (req, res, next) => {
		debug('Body : ')
		debug(req.body)
		
		const error = validationResult(req);
		if(!error.isEmpty()){
			debug('Error : %O',error)
			throw new Error();
		}else{

			const institution = new Institution({
				name: req.body.name,
				address: req.body.address,
				city: req.body.city,
				province: req.body.province,
			})
			debug('Institution : ');
			debug(institution);
			Institution.create(institution, (err, results) =>{
				if(err){return next(err);}
				debug(results)
				res.send(results);
			})
		}
	}

]

exports.update = [
	body('name').trim().isLength({min:1}),
	body('address').trim().escape().isLength({min:1}),
	body('city').trim().escape().isLength({min:1}),
	body('province').trim().escape().isLength({min:1}),
	
	(req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			const institution = new Institution({
				_id: req.params.id,
				name: req.body.name,
				address: req.body.address,
				city: req.body.city,
				province: req.body.province,
			})
			// debug(report)
			Institution.findByIdAndUpdate(req.params.id, institution, (err, results) =>{
				if(err){return (next(err));}
				debug(results)
				res.send(results);
			})
		}
	}

]

exports.delete = (req, res, next) => {
	Institution.findByIdAndRemove(req.params.id).exec((err,results) =>{
		debug(results)
		if(err){return next(err);}
		// res.status(200).send("Sucessfully deleted Institution");
		res.send(results);
	})
}
