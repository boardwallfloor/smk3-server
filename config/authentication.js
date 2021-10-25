const jwt = require('jsonwebtoken')

const User = require('../models/user')

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    try {
      const decodedToken = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
      const id = decodedToken.username
      const user = await User.findOne({ username: id }).lean()
      if (user) {
        req.user = user
        req.id = id
        next()
      } else {
        res.status(401).json('Authentication Token not valid')
      }
    } catch (err) {
      res.status(401).json('Authentication Token not valid')
    }
  } else {
    res.status(401).json('Authentication Token not valid')
  }
}

exports.verifyToken = verifyToken
