const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormSchema = new Schema({
	
	user: {type: Schema.Types.ObjectId, ref:'User', required:true},
	title: {type: String, required: true},
	desc1: {type: String, required: true, max: 300},
	desc2: {type: String, required: true, max: 500},
	bool: {type: Boolean, required:true},
	enum1: {type: String, required: true, enum:['Value 1','Value 2','Value 3'], default: 'Value 2'},
	enum2: {type: String, required:true, enum:['1','2','3','4','5'], default: '5'}
})

module.exports = mongoose.model('Form', FormSchema);