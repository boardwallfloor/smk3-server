const debug = require('debug')('sms');
require('dotenv').config();

const accountSid = `${process.env.TWILLIO_SID}`;
const authToken = `${process.env.TWILLIO_TOKEN}`;
const client = require('twilio')(accountSid, authToken);

exports.sendSmsReminder = (req, res, next) => {
   debug('Sending message')
	client.messages
  .create({
     body: 'Reminder - Laporan SMK3 anda belum diajukan ke sistem, check email atau situs Laporan SMK3.',
     from: '+12019928783',
     to: '+6281326346957'
   })
  .then(message => debug(message.sid));
}
