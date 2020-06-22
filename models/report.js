const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormGroupSchema = new Schema({
	
	userid: {type: Schema.Types.ObjectId, ref:'User', required:true},
	formid: {type: Schema.Types.ObjectId, ref:'Form', default: null},
	status: {type: Boolean, default: false, required: true}
})
const ReportSchema = new Schema({
	
	title: {type: String, required: true},
	detail: {type: String, required: true, max: 300},
	date_of_create: {type: Date}
	formGroup: [FormGroupSchema]
})


module.exports = mongoose.model('Report', ReportSchema);