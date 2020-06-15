const Form = require('../models/form')
const async = require('async')
const debug = require('debug')('Forms')
const { body, validationResult } = require('express-validator');

exports.set_header = (req, res, next) =>{
		Form.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}

exports.show_all = (req, res, next) => {
	if(req.query){
		const filter = JSON.parse(req.query.filter)
		const range = JSON.parse(req.query.range)
		const sort = JSON.parse(req.query.sort)
		const [start, end] = range;
		const [resource, order] = sort;
		const orderLowerCase = order.toLowerCase()
		
		debug(req.query);
		debug(start, end)

		// Form.find({}).sort({[resource]: [orderLowerCase]}).exec(
		// 	(err, results) =>{
		// 		// debug(results);
		// 		res.json(results);
		// 	}
		// 	)
		
		Form.find({}).sort({[resource]: [orderLowerCase]}).skip(start).limit(end-start+1).exec(
			(err, results) =>{
				res.json(results)
			})

	}else{
		Form.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			// debug(results);
			res.json(results);
		}
		)	
	}




}

exports.show_one = (req, res, next) => {
	Form.findById(req.params.id).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results);
			res.json(results);
		}
		)
}

exports.update = [
	body('username').trim().isLength({min:1}),
	body('email').trim().isEmail(),
	body('phonenumber').trim().isNumeric(),
	body('privilege'),

	async (req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
				const hashedPassword = await bcrypt.hash(req.body.password,10)

				const form = new Form({
					username: req.body.username,
					email: req.body.email,
					phonenumber: req.body.phonenumber,
					privilege: req.body.privilege,
					password : hashedPassword,
					_id : req.params.id
				})
				Form.findByIdAndUpdate(req.params.id, form, function (err) {
					if(err){return next(err);}
					res.status(200).send("Successfully updated form").end();
				})
		}
	}
]

exports.delete = (req, res, next) => {
	Form.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		res.status(200).send("Sucessfully deleted form");
	})
}

exports.create = [
	body('user').trim(),
	body('title').trim().isLength({min:1}),
	body('desc1').trim().isLength({min:1}),
	body('desc2').trim().isLength({min:1}),
	body('bool').trim().isBoolean(),
	body('enum1').trim().isLength({min:1}),
	body('enum2').trim().isLength({min:1}),
	
	(req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			const form = new Form({
				user: req.body.user,
				title: req.body.title,
				desc1: req.body.desc1,
				desc2: req.body.desc2,
				bool: req.body.bool,
				enum1: req.body.enum1,
				enum2:  req.body.enum2,
			})
			Form.save(function (err) {
				if(err){return next(err);}
				res.status(200).end();
			})
		}
	}

]