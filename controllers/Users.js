const async = require('async')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const debug = require('debug')('Users')
const passport = require('passport')
const jwt = require('jsonwebtoken');

const User = require('../models/user')

exports.sendCookie = (req, res, next) => {
	// res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true }).send()
	res
        .cookie('jwt',
            token, {
                httpOnly: true,
                secure: false //--> SET TO TRUE ON PRODUCTION
            }
        )
        .status(200)
        .json({
            message: 'You have logged in :D'
        })
}
//Authentication

exports.login = function (req, res, next) {
	debug("Req : %o",req.params)
	debug("Req : %o",req.body)
	// debug("Res : %o",res)
    passport.authenticate('local', {session: false}, (err, user, info) => {
    	debug(user)
        if (err || !user) {
        	debug(req.session)
            return res.status(400).json({
                message: info.msg,
                user   : user,
            });
        }       req.login(user, {session: false}, (err) => {
       if (err) {
           res.send(err);
       }           
       // generate a signed son web token with the contents of user object and return it in the response           
       const token = jwt.sign(user.toJSON(), `${process.env.JWT_SECRET}`);
       // debug("Token : %o",token)T
       return res.cookie('jwt',
            token, {
                httpOnly: true,
                secure: false //--> SET TO TRUE ON PRODUCTION
            }
        )
        .status(200)
        .json(token)
           // return res.json(token);
        });
    })(req, res, next);
}




exports.checkAuth = (req, res, next) => {
	debug("checkAuth Header : %o",req.headers)
	passport.authenticate('jwt', { session: false }, (err,user) => {
		debug(user)
		if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        } 
		if(err){return new Error (err)};
		res.send(user);
	})(req, res, next);
}

exports.set_header = (req, res, next) =>{
		User.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
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

const handleFilter = (filter) => {
	const filterJson = JSON.parse(filter)
	return filterJson;
}

exports.show_all = async (req, res, next) => {

	debug("Show all parameter length : "+Object.keys(req.query).length)

	if(Object.keys(req.query).length === 0){
		debug("No query")
		User.find({}).exec(
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
		
		User.find(filter).select(select).sort(sort).skip(start).limit(limitation).exec(
			(err, results) =>{
				// debug(results)
				res.json(results)
			})
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

exports.show_ten = async(req, res, next) => {
	let filter={};
	debug(req.query)

	if(req.query.filter != undefined){
		filter = await handleFilter(req.query.filter);
	}			
	async.parallel({
		data: (callback) => {
			User.find(filter).limit(10).exec(callback)
		},
		count: (callback) => {
			User.countDocuments(filter).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		debug(results)
		res.json(results);
	})	
}

exports.update = [
	body('username').trim().isLength({min:1}),
	body('first_name').trim().isLength({min:1}),
	body('full_name').trim().isLength({min:1}),
	body('email').trim().isEmail(),
	body('phonenumber').trim().isNumeric(),
	body('privilege'),
	body('job_title').trim().escape().isLength({min:1}),
	body('nip').trim().escape().isLength({min:1}),
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
					first_name: req.body.first_name,
					full_name: req.body.full_name,
					phonenumber: req.body.phonenumber,
					privilege: req.body.privilege,
					job_title: req.body.job_title,
					user_institution: req.body.user_institution,
					nip: req.body.nip,
					password : hashedPassword,
					_id : req.params.id
				})
				User.findByIdAndUpdate(req.params.id, user, function (err, results) {
					if(err){return next(err);}
					res.send(results);
				})
		}
	}
]

exports.delete = (req, res, next) => {
	debug("Delete parameter : "+req.params);
	

	debug(Object.keys(req.query).length)
	if(Object.keys(req.query).length === 0){
		debug("No query")
		User.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		res.send(results);
	})

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
		
		User.find(filter).sort(sortOn).skip(start).limit(end-start+1).exec(
			(err, results) =>{
				res.json(results)
			})
	}
}

exports.create = [
	body('username', 'Username Error').trim().isLength({min:1}),
	body('first_name', 'Test').trim().isLength({min:1}),
	body('full_name').trim().isLength({min:1}),
	body('email', 'Email Error').trim().isEmail(),
	body('phonenumber','Phone Number Error').trim().isNumeric(),
	body('privilege',' Privilege Error'),
	body('job_title','Job Title Error').trim().escape().isLength({min:1}),
	body('nip','NIP Error').trim().escape(),
	body('password','Password Error').trim().isLength({min:1}),
	
	async (req, res, next) => {
		const error = validationResult(req);
		if(!error.isEmpty()){
			console.log(error)
			throw new Error(error[0].msg)
		}else{

				const hashedPassword = await bcrypt.hash(req.body.password,10)

				const user = new User({
					username: req.body.username,
					first_name: req.body.first_name,
					full_name: req.body.full_name,
					email: req.body.email,
					phonenumber: req.body.phonenumber,
					privilege: req.body.privilege,
					job_title: req.body.job_title,
					user_institution: req.body.user_institution,
					nip: req.body.nip,
					password : hashedPassword
				})
				debug(user)
				user.save(function (err, results) {
					if(err){return next(err);}
					res.send(results);
				})

		}
	}
]



