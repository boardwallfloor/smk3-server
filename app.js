var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session')
const cors = require('cors');
const debug = require('debug')('server');
// const MongoStore = require('connect-mongo')
require('dotenv').config();

const initiliazePassport = require('./config/passport')

//Routes
var authRoutes = require('./routes/authRoutes.js');
var userRoutes = require('./routes/userRoutes');
var institutionRoutes = require('./routes/institutionRoutes');
var reportYearlyRoutes = require('./routes/reportYearRoutes');
var reportSemesterlyRoutes = require('./routes/reportSemesterRoutes');
var notificationRoutes = require('./routes/notificationRoutes');
var chartRoutes = require('./routes/chartRoute');



//Mongo
const dbName = 'SMK3'
const MongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-l7zho.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(MongoDB, {useUnifiedTopology : true, useNewUrlParser: true, useCreateIndex: true ,useFindAndModify: false });
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Mongo connection ERROR : '));

//Middleware
var app = express();
const corsOptions = {
  origin: ['http://localhost:3000',' http://192.168.0.8:3000'],
  credentials: true,
  exposedHeaders: ['Content-Range'],
}
app.use(cors(corsOptions))
// console.log(corsOptions)
initiliazePassport.initialize(passport);
initiliazePassport.jwtAuthentication()

app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/tmp')));
// const options = {mongooseConnection : mongoose.connection, mongoUrl: MongoDB}
app.use(session({
	secret: `${process.env.SS_SECRET}`,
	resave: false,
	saveUninitialized: false,
	// store: MongoStore.create(options),
	// cookie: {maxAge : 1 * 10000},
	

}))
app.use(passport.initialize());
app.use(passport.session());


//Routes Middleware
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/reportyear', reportYearlyRoutes);
app.use('/reportsemester', reportSemesterlyRoutes);
app.use('/institution', institutionRoutes);
app.use('/notif', notificationRoutes);
app.use('/chart', chartRoutes);

console.log("Server running at port 9000");

module.exports = app;
