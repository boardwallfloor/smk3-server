const bcrypt = require('bcryptjs')
const passport = require('passport');
const async = require('async');

const User = require('../models/user')
const Test = require('../models/test')
const Form = require('../models/form')

exports.set_header = (req, res, next) =>{
		Test.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}


exports.register = async(req, res, next) =>{
	try{
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = new User (
			{
				first_name : req.body.first_name,
				full_name : req.body.full_name,
				username : req.body.username,
				password : hashedPassword,
				privilege: req.body.privilege,
			}
		);
		console.log(user);
		user.save(function(err){
			if(err){return next(err);}
		res.redirect('login');
		})
	} catch{
		res.redirect('register');
	}
}

exports.initPopulate = (req,res,next) =>{
	User.find({}, '_id').limit(3).exec(
		(err, results) => {
			if(err){return next(err);}
			for(let i = 1; i< results.length; i++){
				test = new Test({
					userid : results[i]._id
				});
			// console.log(results[i+1]._id)
			test.save();
			}
			res.send(results);
			// test.save((err) => {
			// 	if(err){return next(err);}
			// });
			// res.send(results)
		})
}

exports.populate = (req, res, next) => {
	Test.find({}).exec((err, results) => {
		res.send(results);
	})

}

exports.singleFormWithDetail = (req, res, next) => {
	Form.
  findOne({ enum2: '4' }).
  populate('user').
  exec(function (err, results) {
    if (err) return handleError(err);
    res.send(results)
    // prints "The author is Ian Fleming"
  });
}

exports.showAggregate = (req, res, next) => {
	User.aggregate(
		[
			{ $lookup : {
				from: 'test',
				localField: '_id',
				foreignField: 'userid',
				as: 'usesr'
			}},
			// {
			// 	$match: {'test.0':{'$exists':false }}
			// }
		]).exec((err, results) => {
			res.send(results);
		})

}

exports.create = (req, res, next) => {
	async.parallel({
	UserId : (callback) => {
		User.find({}).select('_id').exec(callback)
	},
	UserCount : (callback) => {
		User.countDocuments().exec(callback)
	}},
	(err, results) => {
		let userGroup = [];
		for(let i = 0; i< results.UserCount; i++){
			userGroup[i] = {
				userid: results.UserId[i]._id,
			}
		}

		const report = new Test(
			{
			title : 'Test Title 3',
			desc1 : 'Test Description 3',
			formGroup: userGroup,
		})
		report.save()
		res.send(report);

	}
	)
}


exports.show1 = (req, res, next) => {
	Test.findOne({_id : '5eea3a56b990b11364d3bea6'},'formGroup.userid').exec((err, results) => {
		// console.log(results)
		res.send(results.formGroup[0]);
	})

}

exports.indexof = (req, res, next) => {

	Test.findOneAndUpdate({
		_id: '5eeaa6859fe7c741ff811bc6',
		formGroup: {$elemMatch: {userid: '5ee8fd6f1abd69347cfecf65'}}
	},
	{
		$set: { 'formGroup.$.formid' : "5ee8fd701abd69347cfecf87",
				'formGroup.$.status' : true
	 		  },
	}).exec((err, results) => {
		console.log(results)
		res.send(results)
	})


}

exports.findAndPopulate = (req, res, next) => {
	Test.findById('5eeaa6859fe7c741ff811bc6').populate('formGroup.formid').exec((err, results) => {
		res.send(results)
	})
}

exports.show_all = (req, res, next) => {
	if(req.query.range){
		const filter = JSON.parse(req.query.filter)
		console.log(req.query.range);
		const range = JSON.parse(req.query.range)
		const sort = JSON.parse(req.query.sort)
		const [start, end] = range;
		const [resource, order] = sort;
		const orderLowerCase = order.toLowerCase()
		

		Test.find({}).sort({[resource]: [orderLowerCase]}).skip(start).limit(end-start+1).exec(
			(err, results) =>{
				console.log(results)
				res.json(results)
			})

	}else{
		Test.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			console.log(results);
			res.json(results);
		}
		)	
	}
}

exports.test = (req, res, next) => {
	console.log(req.user)
	res.send(req.user);
}