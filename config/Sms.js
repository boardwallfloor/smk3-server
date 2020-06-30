// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
require('dotenv').config();

const accountSid = `${process.env.TWILLIO_SID}`;
const authToken = `${process.env.TWILLIO_TOKEN}`;
const client = require('twilio')(accountSid, authToken);

exports.sendSmsReminder = (req, res, next) => {
	client.messages
  .create({
     body: 'Reminder - Laporan SMK3 anda belum diajukan ke sistem, check email atau situs Laporan SMK3.',
     from: '+12019928783',
     to: '+6281326346957'
   })
  .then(message => console.log(message.sid));
}
