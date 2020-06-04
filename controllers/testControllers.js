const bcrypt = require('bcryptjs')
const passport = require('passport');

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

exports.test = (req,res,next) =>{
	res.send("WIP")
}