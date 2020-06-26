const email_controller = require('../controllers/Emails')
const notification_controller = require('../controllers/Notifications')

const sms = require('../config/Sms')
const CronJob = require('cron').CronJob;

exports.startSchedule = (results) => {
	console.log('Before job instantiation');
	console.log(results.remind_date)
	let date = results.remind_date;
	// date.setSeconds(date.getSeconds()+2);
	const job = new CronJob(date,async function() {
		const d = new Date();
		console.log('Specific date:', date, ', onTick at:', d);
		await email_controller.sendEmail(results);
		await sms.sendSmsReminder();
		console.log("Job Finished")
	},
	() => {
		notification_controller.setCompletionToTrue();
	});
	console.log('After job instantiation');
	job.start();
}