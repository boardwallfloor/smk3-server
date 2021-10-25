const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const async = require('async')
const debug = require('debug')('passport')
const passportJWT = require('passport-jwt')
const passport = require('passport')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt


const User = require('../models/user')

function initialize (passport) {
  const authenticateUser = (username, password, done) => {
    debug(username, password)
    async.series({
      user: function (callback) {
        User.findOne({ username: username }).exec(callback)
                }
    }, async function (err, results) {
      debug(results)
      if (results.user === null) {
        debug('Null')
        return done(null, false, { msg: 'Username is not found' })
      }
      if (err) { return next(err) }
      debug(results.user.username)
                if (results.user.username == null) {
        debug('No Username')
        return done(null, false, { msg: 'Incorrect username' })
                }
      if (await bcrypt.compare(password, results.user.password)) {
        debug('Authentication successfull')
        return done(null, results.user)
                } else {
        debug('No Password')
        return done(null, false, { msg: 'Incorrect password' })
                }
    }

    )
  }
  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => {
    debug(user)
    return done(null, user.id) 
})
  passport.deserializeUser(async (id, done) =>
    User.findOne({ _id: id }, function (err, results) {
      done(null, results)
    })

  )
}

const jwtAuthentication = () => {
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: `${process.env.JWT_SECRET}`
  },
  async (jwtPayload, cb) => {
    	// TODO: figure out on how to make jwtpayload into object
    	debug('Payload %O', jwtPayload)
    debug(typeof jwtPayload)
    	// const json = await JSON.parse(jwtPayload);
    const json = jwtPayload

        return User.findById(jwtPayload._id)
      .then(user => {
            	// console.log(user)
        return cb(null, user)
            })
      .catch(err => {
        return cb(err)
            })
    }
  ))
}

module.exports = { initialize, jwtAuthentication }
