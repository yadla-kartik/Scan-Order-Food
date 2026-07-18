const compression = require('compression')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')

const apiRoutes = require('./routes/api')

function createApp() {
  const app = express()

  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  }))
  app.use(compression())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(cookieParser())

  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Scan N Order API is running',
      endpoints: {
        api: '/api',
        socket: '/socket.io',
      },
    })
  })

  app.use('/api', apiRoutes)

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
  })

  app.use((error, req, res, next) => {
    console.error(error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Something broke',
    })
  })

  return app
}

module.exports = { createApp }
