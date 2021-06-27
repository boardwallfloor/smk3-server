const email_controller = require('../controllers/Emails')
const notification_controller = require('../controllers/Notifications')
const moment = require('moment')
const debug = require('debug')('cron')

const sms = require('../config/Sms')
const CronJob = require('cron').CronJob;

//Time in utc
//default time in utc
// utc to wib = utc+7
// wib to utc = wib-7

exports.startSchedule = (
	results
	// req, res, next
	) => {
	debug('Before job instantiation');
	const date = new Date()
	// let date = results.remind_date;
	// debug('Input date %o' , date);
	debug('Input date %o' , date);	
	date.setMinutes(date.getMinutes()+2);
	
	debug('Processed date %o', date);
	const job = new CronJob(date,async function() {
		const d = new Date();
		console.log('Specific date:', date, ', onTick at:', d);
		debug('Results %O', results)
		await email_controller.sendEmail(results);
		await sms.sendSmsReminder();
		await notification_controller.setCompletionToTrue(results._id);
	}, null, true, 'Asia/Jakarta');
	debug('After job instantiation');
	job.start();
}

