const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

const BoolQuestionSchema = new Schema({
  information: { type: Boolean, default: false },
  file: {
    src: { type: String, default: undefined },
    title: { type: String, default: undefined }
  },
  comment: { type: String, max: 300 }
}, { _id: false })

const TextQuestionSchema = new Schema({
  information: { type: String, default: null },
  comment: { type: String, max: 300 }
}, { _id: false })

const DuoBoolQuestionSchema = new Schema({
  a: BoolQuestionSchema,
  b: BoolQuestionSchema
}, { _id: false })

const TrioBoolQuestionSchema = new Schema({
  a: BoolQuestionSchema,
  b: BoolQuestionSchema,
  c: BoolQuestionSchema
}, { _id: false })

// const OneBoolTwoTextQuestionSchema = new Schema({
//   a: BoolQuestionSchema,
//   b: TextQuestionSchema,
//   c: TextQuestionSchema
// }, { _id: false })

const OneBoolOneTextQuestionSchema = new Schema({
  a: BoolQuestionSchema,
  b: TextQuestionSchema
}, { _id: false })

const FourTextOneBoolQuestionSchema = new Schema({
  a: TextQuestionSchema,
  b: TextQuestionSchema,
  c: TextQuestionSchema,
  d: TextQuestionSchema,
  e: BoolQuestionSchema,
}, { _id: false })

const reportGroupSchema = new Schema({
  question1: TrioBoolQuestionSchema,
  question2: TrioBoolQuestionSchema,
  question3: {
    a: BoolQuestionSchema,
    b: BoolQuestionSchema,
    c: BoolQuestionSchema,
    d: BoolQuestionSchema
  },
  question4: {
    a: BoolQuestionSchema,
    b: BoolQuestionSchema,
    c: BoolQuestionSchema,
    d: BoolQuestionSchema
  },
  question5: DuoBoolQuestionSchema,
  question6: DuoBoolQuestionSchema,
  question7: TrioBoolQuestionSchema,
  question8: {
    a: BoolQuestionSchema,
    b: BoolQuestionSchema,
    c: BoolQuestionSchema,
    d: BoolQuestionSchema
  },
  question9: BoolQuestionSchema,
  question10: {
    a: BoolQuestionSchema,
    b: FourTextOneBoolQuestionSchema,
    c: DuoBoolQuestionSchema
  },
  question11: OneBoolOneTextQuestionSchema
}, { _id: false })

const ReportYearSchema = new Schema({

  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  year: { type: Date },
  report: reportGroupSchema,
  validated: { type: String, enum: ['Tervalidasi', 'Belum Tervalidasi', 'Butuh Revisi'], default: 'Belum Tervalidasi' }
}, { timestamps: { createdAt: 'created_at' } })

ReportYearSchema
  .virtual('year_formatted')
  .get(function () {
    return this.year ? moment(this.year).format('YYYY') : 'NaN'
  })
module.exports = mongoose.model('ReportYear', ReportYearSchema)
