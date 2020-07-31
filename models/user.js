const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	
	username:{type: String, required: true, unique:true},
	first_name:{type: String, required: true},
	full_name:{type: String, required: true},
	email:{type: String, required: true},
	phonenumber:{type: Number, required: true},
	privilege:{type: String, required:true, enum:['Admin','User'], default: 'User'},
	job_title:{type: String, required:true},
	user_institution: {type: Schema.Types.ObjectId, ref:'Institution', required: true},
	nip: {type:String, default: null},
	password:{type: String, required: true, min:8}
})

module.exports = mongoose.model('User', UserSchema);