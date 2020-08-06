const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
	total: {type: Number, required: true},
	file: {
		src:{type: String},
		title:{type: String},
	},
	detail: {type: String, max: 300},
},{ _id : false })

const reportGroupSchema = new Schema({
	question1: questionSchema,
	question2: questionSchema,
	question3: questionSchema,
	question4: questionSchema,
	question5: questionSchema,
	question6: questionSchema,
	question7: questionSchema,
	question8: questionSchema,
},{ _id : false })

const ReportSemesterSchema = new Schema({
	
	author: {type: Schema.Types.ObjectId, ref:'User', required: true},
	date: {type: Date, default: Date.now},
	institution:{type: Schema.Types.ObjectId, ref:'Institution', required: true},
	report: reportGroupSchema ,
	validated: {type: Boolean, default: false},
})


module.exports = mongoose.model('ReportSemester', ReportSemesterSchema);