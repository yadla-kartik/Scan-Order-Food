const mongoose = require('mongoose')

async function connectDB() {
  const uri = process.env.MONGO_DB || process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGO_DB or MONGODB_URI is required')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  console.log('MongoDB connected')
}

module.exports = { connectDB }
