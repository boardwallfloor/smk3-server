const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstitutionSchema = new Schema({
	
	name: {type: String, required: true, max: 100},
	address: {type: String, required: true, max: 300},
	area: {type: Number, required: true},
	city: {type: String, required: true, max: 25},
	province: {type: String, required: true, max: 25},
})

module.exports = mongoose.model('Institution', InstitutionSchema);