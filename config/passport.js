const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const async = require('async');
const debug = require('debug')('passport');

const User = require('../models/user');

function initialize(passport) {

    const authenticateUser = async (username, password, done) => {

        debug(username, password)
        async.series({
                user: function(callback) {
                    User.findOne({ username: username }).exec(callback);
                }
            }, function(err, results) {
                debug(results)
                if(results.user === null){
                    debug("Null")
                    return done(null, false,{ msg: "Username or password is null"})
                }
                if (err) { return next(err); }
                debug(results.user.username);
                if (results.user.username == null) {
                    debug('No Username')
                    return done(null, false, { msg: "Incorrect username" });
                }
                if (bcrypt.compare(password, results.user.password)) {
                    debug("Authentication successfull")
                    return done(null, results.user);
                } else {
                    debug('No Password')
                    return done(null, false, { msg: "Incorrect password" });
                }
            	
            }

        )


    }
    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
    passport.serializeUser((user, done) =>{
        debug(user)
        return done(null, user.id)} )
    passport.deserializeUser(async (id, done) => 
        User.findOne({_id:id}, function(err, results){
            done(null, results)
        })
    
        )



}

module.exports = initialize;