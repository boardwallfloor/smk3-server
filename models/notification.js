const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	
	complete_status: {type: Boolean, default:false},
	remindee: {type: Schema.Types.ObjectId, ref:'User', required: true},
	remind_date: {type: Date, required: true},
	report_type: {type: String, required:true, enum:['yearly','semesterly']}
})

module.exports = mongoose.model('Notification', NotificationSchema);