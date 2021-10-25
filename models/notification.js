const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({

  notification_status: { type: String, enum: ['Belum Dikirim', 'Peringatan Dikirim', 'Laporan Dibuat'], default: 'Belum Dikirim' },
  remindee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  remind_date: { type: Date, required: true },
  report_type: { type: String, required: true, enum: ['yearly', 'semesterly'] },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true }

}, { timestamps: { createdAt: 'created_at' } })

module.exports = mongoose.model('Notification', NotificationSchema)
