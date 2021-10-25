const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InstitutionSchema = new Schema({

  name: { type: String, required: true, max: 100, unique: true },
  address: { type: String, required: true, max: 300 },
  city: { type: String, required: true, max: 25 },
  province: { type: String, required: true, max: 25 }
}, { timestamps: { createdAt: 'created_at' } })

module.exports = mongoose.model('Institution', InstitutionSchema)
