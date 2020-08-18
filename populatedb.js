#! /usr/bin/env node

console.log("Populate DB");

var User = require('./models/user')
var Institution = require('./models/institution')
var Notification = require('./models/notification')
var Report_Year = require('./models/report_year')
var Report_Semester = require('./models/report_semester')

const faker = require('faker/locale/id_ID')
const async = require('async')
require('dotenv').config();

console.log("Connecting to Database")


var mongoose = require('mongoose');
const dbName = 'SMK3'
const MongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-l7zho.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(MongoDB, {useUnifiedTopology : true, useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Mongo connection ERROR : '));
console.log("Connection successfull")

const institutions = [];
const users = [];

const enumPrivilege = ['Admin','Operator','Kepala Fasyankes','Dinas Kesehatan'];
const enumReportType = ['yearly','semesterly'];

function userCreate(username, first_name, full_name, email, phonenumber, privilege, job_title, user_institution, nip, password, cb) {
  console.log("Creating User")
  userDetail = {
    username: username,
    first_name: first_name,
    full_name: full_name,
    email: email,
    phonenumber: phonenumber,
    privilege: privilege,
    job_title: job_title,
    user_institution: user_institution,
    nip: nip,
    password: password,
  }
  const user = new User(userDetail);
       
  user.save(function (err) {
    if (err) {
      console.log('Error at creating user : ' + err);
      cb(err, null)
      return;
    }
    console.log('New user: ' + user);
    users.push(user)
    cb(null, user);
  });
}

function institutionCreate(name, address, city, province, cb) {
  console.log("Creating Institution")
  institutionDetail = {
    name: name,
    address: address,
    city: city,
    province: province,
  }

  const institution = new Institution(institutionDetail);
       
  institution.save(function (err) {
    if (err) {
      console.log('Error at creating institution : ' + err);
      cb(err, null)
      return;
    }
    console.log('New institution: ' + institution);
    institutions.push(institution);
    cb(null, institution);
  });
}



function notificationCreate(complete_status, remindee, remind_date, report_type, cb) {
  console.log("Creating Notification")
  notificationDetail = {
    complete_status: complete_status,
    remindee: remindee,
    remind_date: remind_date,
    report_type: report_type,
  }
  console.log(notificationDetail)
  const notification = new Notification(notificationDetail);
       
  notification.save(function (err) {
    if (err) {
      console.log('Error at creating notification : ' + err);
      cb(err, null)
      return;
    }

    console.log('New notification: ' + notification);
    cb(null, notification);
  });
}

const createNip = () => {
  const birthYear = faker.random.number({min:1970,max:1999})
  let birthMonth = faker.random.number({min:1,max:12})
  let birthDay = faker.random.number({min:1,max:31})
  const employYear = faker.random.number({min:[birthYear],max:2020})
  let employMonth = faker.random.number({min:1,max:12})
  const gender = faker.random.number({min:1,max:2})
  let order = faker.random.number({min:1,max:100})

  if(birthMonth < 10){
    birthMonth = '0'+ birthMonth
  }
  if(birthDay < 10){
    birthDay = '0' + birthDay
  }
  if(employMonth < 10){
    employMonth = '0' + employMonth
  }
  if(order < 10){
    order = '0' + order
  }

  return (`${birthYear}${birthMonth}${birthDay} ${employYear}${employMonth} ${gender} ${order}`)
}

function createInstitution(cb) {
    async.series([
        function(callback){
          const name = faker.company.companyName(0)
          const address = faker.address.streetAddress("###")
          const city = faker.address.city(3)
          const province = faker.address.state()
          institutionCreate(name, address, city, province, callback);
        },
        function(callback){
          const name = faker.company.companyName(0)
          const address = faker.address.streetAddress("###")
          const city = faker.address.city(3)
          const province = faker.address.state()
          institutionCreate(name, address, city, province, callback);
        },
        function(callback){
          const name = faker.company.companyName(0)
          const address = faker.address.streetAddress("###")
          const city = faker.address.city(3)
          const province = faker.address.state()
          institutionCreate(name, address, city, province, callback);
        },
        function(callback){
          const name = faker.company.companyName(0)
          const address = faker.address.streetAddress("###")
          const city = faker.address.city(3)
          const province = faker.address.state()
          institutionCreate(name, address, city, province, callback);
        },


        ],
        // optional callback
        cb);
}

function createNotification(cb) {
    async.series([
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },
        function(callback){
          const complete_status = faker.random.boolean()
          const remindee = faker.random.arrayElement(users)
          const remind_date = faker.date.between('2020-08-01', '2020-9-31')
          const report_type = faker.random.arrayElement(enumReportType)
          notificationCreate(complete_status, remindee, remind_date, report_type, callback);
        },


        ],
        // optional callback
        cb);
}

function createUser(cb) {
    async.series([
        function (callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumberFormat(0);
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          const first_name = faker.name.firstName()
          const full_name = `${first_name} ${faker.name.lastName()}`
          const job_title = faker.name.jobTitle()
          const user_institution = faker.random.arrayElement(institutions)
          const nip = createNip()
          userCreate(username, first_name, full_name, email, phonenumber, privilege, job_title, user_institution, nip, password, callback);
        },
        function (callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumberFormat(0);
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          const first_name = faker.name.firstName()
          const full_name = `${first_name} ${faker.name.lastName()}`
          const job_title = faker.name.jobTitle()
          const user_institution = faker.random.arrayElement(institutions)
          const nip = createNip()
          userCreate(username, first_name, full_name, email, phonenumber, privilege, job_title, user_institution, nip, password, callback);
        },
        function (callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumberFormat(0);
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          const first_name = faker.name.firstName()
          const full_name = `${first_name} ${faker.name.lastName()}`
          const job_title = faker.name.jobTitle()
          const user_institution = faker.random.arrayElement(institutions)
          const nip = createNip()
          userCreate(username, first_name, full_name, email, phonenumber, privilege, job_title, user_institution, nip, password, callback);
        },
        function (callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumberFormat(0);
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          const first_name = faker.name.firstName()
          const full_name = `${first_name} ${faker.name.lastName()}`
          const job_title = faker.name.jobTitle()
          const user_institution = faker.random.arrayElement(institutions)
          const nip = createNip()
          userCreate(username, first_name, full_name, email, phonenumber, privilege, job_title, user_institution, nip, password, callback);
        },
        function (callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumberFormat(0);
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          const first_name = faker.name.firstName()
          const full_name = `${first_name} ${faker.name.lastName()}`
          const job_title = faker.name.jobTitle()
          const user_institution = faker.random.arrayElement(institutions)
          const nip = createNip()
          userCreate(username, first_name, full_name, email, phonenumber, privilege, job_title, user_institution, nip, password, callback);
        },
        function (callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumberFormat(0);
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          const first_name = faker.name.firstName()
          const full_name = `${first_name} ${faker.name.lastName()}`
          const job_title = faker.name.jobTitle()
          const user_institution = faker.random.arrayElement(institutions)
          const nip = createNip()
          userCreate(username, first_name, full_name, email, phonenumber, privilege, job_title, user_institution, nip, password, callback);
        },
        function (callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumberFormat(0);
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          const first_name = faker.name.firstName()
          const full_name = `${first_name} ${faker.name.lastName()}`
          const job_title = faker.name.jobTitle()
          const user_institution = faker.random.arrayElement(institutions)
          const nip = createNip()
          userCreate(username, first_name, full_name, email, phonenumber, privilege, job_title, user_institution, nip, password, callback);
        },


        ],
        // optional callback
        cb);
}




async.series([
    createInstitution,
    createUser,
    createNotification
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    } 
    // All done, disconnect from database 
    console.log("Finished populating");
    mongoose.connection.close();
}); 