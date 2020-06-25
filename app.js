var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session')
const cors = require('cors');
require('dotenv').config();

const initiliazePassport = require('./config/passport')

//Routes
var authRoutes = require('./routes/authRoutes.js');
var userRoutes = require('./routes/userRoutes');
var institutionRoutes = require('./routes/institutionRoutes');
var reportYearlyRoutes = require('./routes/reportYearRoutes');
var reportSemesterlyRoutes = require('./routes/reportSemesterRoutes');



//Mongo
const MongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-l7zho.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(MongoDB, {useUnifiedTopology : true, useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Mongo connection ERROR : '));

//Middleware
var app = express();
const corsOptions = {
  origin: ['http://localhost:3000','192.168.100.62:3000'],
  credentials: true,
  exposedHeaders: ['Content-Range'],
}
app.use(cors(corsOptions))
// console.log(corsOptions)
initiliazePassport(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: `${process.env.SS_SECRET}`,
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


//Routes Middleware
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/reportyear', reportYearlyRoutes);
app.use('/reportsemester', reportSemesterlyRoutes);
app.use('/institution', institutionRoutes);

console.log("Server running at port 9000");

//TEST
//For Development Only

//console.log("Remember to comment Test in app.js when in production")
// const testRoutes = require('./routes/testRoutes')
// app.use('/test',testRoutes);

module.exports = app;
