const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstitutionSchema = new Schema({
	
	name: {type: String, required: true, max: 100},
	address: {type: String, required: true, max: 300},
	city: {type: String, required: true, max: 25},
	province: {type: String, required: true, max: 25},

	//TEST
	file:{ 
		rawFile :{
			path:{type: String}
		},
		src:{type: String},
		title: {type: String}
	}
	// file:{type: Buffer}
})

module.exports = mongoose.model('Institution', InstitutionSchema);