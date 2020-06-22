const async = require('async');
const debug = require('debug')('Reports');

const User = require('../models/user')
const Report = require('../models/report')
const Form = require('../models/form')

exports.set_header = (req, res, next) =>{
		Report.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}


exports.show_all = (req, res, next) => {
	debug(Object.keys(req.query).length)
	if(Object.keys(req.query).length === 0){
		console.log("No query")
		Report.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			// debug(results);
			res.json(results);
		}
		)	

	}else{
		const filter = JSON.parse(req.query.filter)
		const range = JSON.parse(req.query.range)
		const sort = JSON.parse(req.query.sort)
		const [start, end] = range;
		const [resource, order] = sort;
		const orderLowerCase = order.toLowerCase()
		
		debug(req.query);
		debug(start, end)
		
		Report.find({}).sort({[resource]: [orderLowerCase]}).skip(start).limit(end-start+1).exec(
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

		const report = new Report(
			{
			title : 'Report Title 3',
			desc1 : 'Report Description 3',
			formGroup: userGroup,
		})
		report.save()
		res.send(report);

	}
	)
}

exports.update = (req, res, next) => {
	

	Report.findOneAndUpdate({
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




