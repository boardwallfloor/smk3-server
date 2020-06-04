const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const async = require('async');

const User = require('../models/user');

function initialize(passport) {

    const authenticateUser = async (username, password, done) => {
        async.series({
                user: function(callback) {
                    User.findOne({ username: username }).exec(callback);
                }
            }, function(err, results) {
                if (err) { return next(err); }
                if (results.user.username == null) {
                    console.log('No Username')
                    return done(null, false, { msg: "Incorrect username" });
                }
                if (bcrypt.compare(password, results.user.password)) {
                    return done(null, results.user);
                } else {
                    console.log('No Password')
                    return done(null, false, { msg: "Incorrect password" });
                }
            	
            }

        )


    }
    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
    passport.serializeUser((user, done) =>{
    return done(null, user.id)} )
    passport.deserializeUser(async (id, done) => 
        User.findOne({_id:id}, function(err, results){
            done(null, results)
        })
    
        )



}

module.exports = initialize;