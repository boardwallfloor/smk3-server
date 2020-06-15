const async = require('async')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const debug = require('debug')('Users')

const User = require('../models/user')

exports.set_header = (req, res, next) =>{
		User.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}

exports.show_all = (req, res, next) => {
	if(req.query.range){
		const filter = JSON.parse(req.query.filter)
		debug(req.query.range);
		const range = JSON.parse(req.query.range)
		const sort = JSON.parse(req.query.sort)
		const [start, end] = range;
		const [resource, order] = sort;
		const orderLowerCase = order.toLowerCase()
		

		User.find({}).sort({[resource]: [orderLowerCase]}).skip(start).limit(end-start+1).exec(
			(err, results) =>{
				debug(results)
				res.json(results)
			})

	}else{
		User.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results);
			res.json(results);
		}
		)	
	}
}

exports.show_one = (req, res, next) => {
	User.findById(req.params.id).exec(
		(err, results) =>{
			if(err){return next(err);}
			// debug(results);
			res.json(results);
		})
}

exports.update = [
	body('username').trim().isLength({min:1}),
	body('email').trim().isEmail(),
	body('phonenumber').trim().isNumeric(),
	body('privilege'),
	body('password').trim().isLength({min:1}),

	async (req, res, next) => {
		const error = validationResult(req);

		if(!error.isEmpty()){
			debug(error)
			throw new Error(error);
		}else{
				const hashedPassword = await bcrypt.hash(req.body.password,10)

				const user = new User({
					username: req.body.username,
					email: req.body.email,
					phonenumber: req.body.phonenumber,
					privilege: req.body.privilege,
					password : hashedPassword,
					_id : req.params.id
				})
				User.findByIdAndUpdate(req.params.id, user, function (err) {
					if(err){return next(err);}
					res.status(200).send("Successfully updated user").end();
				})
		}
	}
]

exports.delete = (req, res, next) => {
	User.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		res.status(200).send("Sucessfully deleted user");
	})
}

exports.create = [
	body('username').trim().isLength({min:1}),
	body('email').trim().isEmail(),
	body('phonenumber').trim().isNumeric(),
	body('privilege'),
	body('password').trim(),
	
	async (req, res, next) => {
		const error = validationResult(req);
		if(!error.isEmpty()){
			throw new Error("Error : ")
		}else{

				const hashedPassword = await bcrypt.hash(req.body.password,10)

				const user = new User({
					username: req.body.username,
					email: req.body.email,
					phonenumber: req.body.phonenumber,
					privilege: req.body.privilege,
					password : hashedPassword
				})
				debug(user)
				user.save(function (err) {
					if(err){return next(err);}
					res.status(200).end();
				})

		}
	}
]

exports.login = passport.authenticate('local')
