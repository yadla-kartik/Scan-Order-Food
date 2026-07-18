const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNo: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['customer', 'chef', 'admin'],
    default: 'customer',
  },
  isOrderDone: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

module.exports = mongoose.models.user || mongoose.model('user', userSchema)
