const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
	total: {type: Number, required: true},
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
	month: {type: String, required:true, enum:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"], default: 'Januari'},
	year: {type: Date, default: Date.now},
	institution:{type: Schema.Types.ObjectId, ref:'Institution', required: true},
	report: reportGroupSchema ,
})


module.exports = mongoose.model('ReportSemester', ReportSemesterSchema);