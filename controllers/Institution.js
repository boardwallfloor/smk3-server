const async = require('async')
const debug = require('debug')('institution')
const { body, validationResult } = require('express-validator');

const Institution = require('../models/institution.js')

exports.set_header = (req, res, next) =>{
		Institution.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}

exports.show_all = (req, res, next) => {
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
		
		Institution.find(filter).sort(sortOn).skip(start).limit(end-start+1).exec(
			(err, results) =>{
				res.json(results)
			})
	}

}

exports.show_one = (req, res, next) => {
	Institution.findById(req.params.id).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results);
			res.json(results);
		}
		)
}

exports.create = [
	body('name').trim().isLength({min:1}),
	body('address').trim().escape().isLength({min:1}),
	body('city').trim().escape().isLength({min:1}),
	body('province').trim().escape().isLength({min:1}),
	body('area').trim().isLength({min:1}).isNumeric(),
	
	(req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			const institution = new Institution({
				name: req.body.name,
				address: req.body.address,
				city: req.body.city,
				province: req.body.province,
				area: req.body.area
			})
			// debug(institution);
			Institution.create(institution, (err, results) =>{
				if(err){return next(err);}
				debug(results)
				res.send("Successfully created per Institution");
			})
		}
	}

]

exports.update = [
	body('name').trim().isLength({min:1}),
	body('address').trim().escape().isLength({min:1}),
	body('city').trim().escape().isLength({min:1}),
	body('province').trim().escape().isLength({min:1}),
	body('area').trim().isLength({min:1}).isNumeric(),
	
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
				area: req.body.area
			})
			// debug(report)
			Institution.findByIdAndUpdate(req.params.id, institution, (err, results) =>{
				if(err){return (next(err));}
				debug(results)
				res.send("Successfully updated per Institution");
			})
		}
	}

]

exports.delete = (req, res, next) => {
	Institution.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		// res.status(200).send("Sucessfully deleted Institution");
		res.json(results);
	})
}
