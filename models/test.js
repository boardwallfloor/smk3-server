const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormGroupSchema = new Schema({
	
	userid: {type: Schema.Types.ObjectId, ref:'User', required:true},
	formid: {type: Schema.Types.ObjectId, ref:'Form', default: null},
	status: {type: Boolean, default: false, required: true}
})
const TestSchema = new Schema({
	
	title: {type: String, required: true},
	desc1: {type: String, required: true, max: 300},
	formGroup: [FormGroupSchema]
})


module.exports = mongoose.model('Test', TestSchema);