const mongoose = require('mongoose')

const userItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Served', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Not Paid'],
    default: 'Pending',
  },
  payed: {
    type: String,
    enum: ['Online', 'Cash On Counter', ''],
    default: '',
  },
}, { timestamps: true })

const foodSchema = new mongoose.Schema({
  userItem: [userItemSchema],
}, { timestamps: true })

module.exports = mongoose.models.food || mongoose.model('food', foodSchema)
