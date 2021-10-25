const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
// const debug = require('debug')('server')
const auth = require('./config/authentication')
// const MongoStore = require('connect-mongo')
require('dotenv').config()

const initiliazePassport = require('./config/passport')

// Routes
const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes')
const institutionRoutes = require('./routes/institutionRoutes')
const reportYearlyRoutes = require('./routes/reportYearRoutes')
const reportSemesterlyRoutes = require('./routes/reportSemesterRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const chartRoutes = require('./routes/chartRoute')

// Mongo
const dbName = 'SMK3'
const MongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-l7zho.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(MongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongo connection ERROR : '))

// Middleware
const app = express()
const corsOptions = {
  origin: [
    'https://smk3-ugm.netlify.app',
    `${process.env.CLIENT_DOMAIN}`,
    'http://192.168.1.19:3000',
    'https://smk3-ugm.netlify.app/#/reportsemester/create/report'
  ],
  credentials: true,
  exposedHeaders: ['Content-Range']
}
app.use(cors(corsOptions))
// console.log(corsOptions)
initiliazePassport.initialize(passport)
initiliazePassport.jwtAuthentication()

app.use(express.json({ limit: '50mb', extended: true }))
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/tmp')))
// const options = {mongooseConnection : mongoose.connection, mongoUrl: MongoDB}
app.use(
  session({
    secret: `${process.env.SS_SECRET}`,
    resave: false,
    saveUninitialized: false
    // store: MongoStore.create(options),
    // cookie: {maxAge : 1 * 10000},
  })
)
// app.use(passport.initialize());
// app.use(passport.session());

// Welcome
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/welcome.html'))
})
// Routes Middleware
app.use('/auth', authRoutes)
app.use('/user', auth.verifyToken, userRoutes)
// app.use('/user', userRoutes);
app.use(
  '/reportyear',
  auth.verifyToken,
  reportYearlyRoutes
)
app.use(
  '/reportsemester',
  auth.verifyToken,
  reportSemesterlyRoutes
)
app.use(
  '/institution',
  auth.verifyToken,
  institutionRoutes
)
app.use(
  '/notif',
  auth.verifyToken,
  notificationRoutes
)
app.use(
  '/chart',
  auth.verifyToken,
  chartRoutes
)

console.log('Server running at port 9000')

module.exports = app
