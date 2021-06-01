const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')

const BoolQuestionSchema = new Schema({
	information: {type: Boolean, default: false},
	file:{ 
		src:{type: String, default: undefined},
		title:{type: String, default: undefined},
		}
},{ _id : false })

const TextQuestionSchema = new Schema({
	information: {type: String, default:null},
},{ _id : false })

const DuoBoolQuestionSchema = new Schema({
	a: BoolQuestionSchema,
	b: BoolQuestionSchema,
},{ _id : false })

const TrioBoolQuestionSchema = new Schema({
	a: BoolQuestionSchema,
	b: BoolQuestionSchema,
	c: BoolQuestionSchema,
},{ _id : false })

const OneBoolTwoTextQuestionSchema = new Schema({
	a: BoolQuestionSchema,
	b: TextQuestionSchema,
	c: TextQuestionSchema,
},{ _id : false })

const OneBoolOneTextQuestionSchema = new Schema({
	a: BoolQuestionSchema,
	b: TextQuestionSchema,
},{ _id : false })

const reportGroupSchema = new Schema({
	question1: TrioBoolQuestionSchema,
	question2: TrioBoolQuestionSchema,
	question3: {
		a: BoolQuestionSchema,
		b: BoolQuestionSchema,
		c: BoolQuestionSchema,
		d: BoolQuestionSchema,
	},
	question4: TrioBoolQuestionSchema,
	question5: TrioBoolQuestionSchema,
	question6: DuoBoolQuestionSchema,
	question8: {
		a: BoolQuestionSchema,
		b: BoolQuestionSchema,
		c: BoolQuestionSchema,
		d: BoolQuestionSchema,
	},
	question8: TrioBoolQuestionSchema,
	question9: BoolQuestionSchema,
	question10: {
		a: BoolQuestionSchema,
		b: OneBoolTwoTextQuestionSchema,
		c: DuoBoolQuestionSchema,
	},
	question11: OneBoolOneTextQuestionSchema,
	},{ _id : false })

const ReportYearSchema = new Schema({
	
	author: {type: Schema.Types.ObjectId, ref:'User', required: true},
	institution:{type: Schema.Types.ObjectId, ref:'Institution', required: true},
	totalSDM:{type: Number, required: true},
	year: {type: Date},
	report: reportGroupSchema,
	validated: {type: Boolean, default: false},
})

ReportYearSchema
.virtual('year_formatted')
.get(function () {
  return this.year ? moment(this.year).format('YYYY') : 'NaN';
});
module.exports = mongoose.model('ReportYear', ReportYearSchema);