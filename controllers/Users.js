const async = require('async')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const debug = require('debug')('Users')

const jwt = require('jsonwebtoken');


const User = require('../models/user')

exports.set_header = (req, res, next) =>{
		User.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}

exports.show_all = async (req, res, next) => {

	debug("Show all parameter length : "+Object.keys(req.query).length)

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
		
		User.find(filter).sort(sort).skip(start).limit(limitation).exec(
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

exports.update = [
	body('username').trim().isLength({min:1}),
	body('first_name').trim().isLength({min:1}),
	body('full_name').trim().isLength({min:1}),
	body('email').trim().isEmail(),
	body('phonenumber').trim().isNumeric(),
	body('privilege'),
	body('jobtitle').trim().escape().isLength({min:1}),
	body('nip').trim().escape().isLength({min:1}),
	body('password').trim().isLength({min:1}),

	async (req, res, next) => {
		console.log("msg")
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
					jobtitle: req.body.jobtitle,
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
	body('jobtitle','Job Title Error').trim().escape().isLength({min:1}),
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
					jobtitle: req.body.jobtitle,
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


//Authentication

exports.login = function (req, res) {
	debug('test')
    passport.authenticate('local', {session: false}, (err, user, info) => {
		debug("Error : ")
		debug(err)
		debug('User : ',user)
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }      
        req.login(user, {session: false}, (err) => {
           if (err) {
           	debug(err)
               res.send(err);
           }           // generate a signed son web token with the contents of user object and return it in the response

           const token = jwt.sign(user.toJSON(), `${process.env.JWT_SECRET}`);
           return res.json({user, token});
        });
    })(req, res);
}

exports.checkAuth =  () => {
	passport.authenticate('jwt', {session: false}),
function(req, res) {
        res.send(req.user.profile);
    	debug('test')
    }

}
