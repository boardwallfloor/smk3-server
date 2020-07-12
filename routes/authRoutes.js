var express = require('express');
var router = express.Router();
const debug = require('debug')('authroutes')
const jwt = require('jsonwebtoken');
const passport = require('passport')
require('dotenv').config();


const user_controller = require('../controllers/Users');

/* POST login. */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }           // generate a signed son web token with the contents of user object and return it in the response           
           const token = jwt.sign(user.toString(), `${process.env.JWT_SECRET}`);
           return res.json({user, token});
        });
    })(req, res, next);
});

// router.post('/test', user_controller.testAuthCheck)
// router.post('/login', user_controller.login);
module.exports = router;