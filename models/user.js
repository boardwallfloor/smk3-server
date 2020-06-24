const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	
	username:{type: String, required: true},
	email:{type: String, required: true},
	phonenumber:{type: String, required: true},
	privilege:{type: String, required:true, enum:['Admin','User'], default: 'User'},
	jobtitle:{type: String, required:true},
	nip: {type:String, default: null},
	password:{type: String, required: true, min:8}
})

module.exports = mongoose.model('User', UserSchema);