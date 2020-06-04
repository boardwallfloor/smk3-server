#! /usr/bin/env node

console.log("Populate DB");

var User = require('./models/user')
var Form = require('./models/form')

const faker = require('faker')
const async = require('async')
require('dotenv').config();

console.log("Connecting to Database")


var mongoose = require('mongoose');
const MongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-l7zho.mongodb.net/test?retryWrites=true&w=majority`;;
mongoose.connect(MongoDB, {useUnifiedTopology : true, useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Mongo connection ERROR : '));
console.log("Connection successfull")

const users = [];
const enumValue = ['Value 1','Value 2','Value 3'];
const enumCount = ['1','2','3','4','5'];

const enumPrivilege = ['A','B','C'];

function userCreate(username, email, phonenumber, privilege, password, cb) {
  console.log("Creating User")
  userDetail = {
    username: username,
    email: email,
    phonenumber: phonenumber,
    privilege: privilege,
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
    users.push(user);
    cb(null, user);
  });
}

function formCreate(user, title, desc1, desc2, bool, enum1, enum2, cb) {
  console.log("Creating Form")
  formDetail = {
    user: user,
    title: title,
    desc1: desc1,
    desc2: desc2,
    bool: bool,
    enum1: enum1,
    enum2: enum2,
  }

  const form = new Form(formDetail);
       
  form.save(function (err) {
    if (err) {
      console.log('Error at creating form : ' + err);
      cb(err, null)
      return;
    }

    console.log('New form: ' + form);
    cb(null, form);
  });
}





// function createForm(iteration) {
//   console.log("Generating form")
//     for(let i= 0;i < iteration;i++){
//       const user = faker.internet.userName();
//       const title = faker.random.words(5);
//       const desc1 = faker.lorem.lines();
//       const desc2 = faker.lorem.words();
//       const bool = faker.random.boolean();
//       const enum1 = faker.random.arrayElement(enumValue);
//       const enum2 = faker.random.arrayElement(enumCount);
//     formCreate(user,title,desc1,desc2,bool,enum1,enum2);
//     }

// }

function createUser(cb) {
    async.series([
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },
        function(callback){
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phonenumber = faker.phone.phoneNumber();
          const privilege = faker.random.arrayElement(enumPrivilege);
          const password = faker.internet.password(8);
          userCreate(username,email,phonenumber,privilege,password, callback);
        },


        ],
        // optional callback
        cb);
}

// function createUser(iteration) {
//   console.log("Generating user")
//     for(let i= 0;i < iteration;i++){
//       const username = faker.internet.userName();
//       const email = faker.internet.email();
//       const phonenumber = faker.phone.phoneNumber();
//       const privilege = faker.random.arrayElement(enumPrivilege);
//     userCreate(username, email, phonenumber, privilege);
//     }

// }

function createForm(cb) {
    async.series([
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
        function(callback){
          const user = faker.random.arrayElement(users);
          const title = faker.random.words(5);
          const desc1 = faker.lorem.lines();
          const desc2 = faker.lorem.words();
          const bool = faker.random.boolean();
          const enum1 = faker.random.arrayElement(enumValue);
          const enum2 = faker.random.arrayElement(enumCount);
          formCreate(user,title, desc1, desc2,bool, enum1, enum2, callback);
        },
 


        ],
        // optional callback
        cb);
}


async.series([
    createUser,
    // createForm
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