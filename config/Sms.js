// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACe74d249fe5264453857ba971fd88b5dc';
const authToken = '02aad2959316c4acc15b1a514e4bc8b4';
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
