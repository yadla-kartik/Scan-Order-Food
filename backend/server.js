const http = require('http')
const path = require('path')
const { Server } = require('socket.io')
const { createApp } = require('./src/app')
const { connectDB } = require('./src/config/db')
const { registerSocketHandlers } = require('./src/services/socketService')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const port = process.env.PORT || 8000
const app = createApp()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true,
  },
})

app.set('io', io)
registerSocketHandlers(io)

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Scan N Order backend running on PORT ${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start backend:', error.message)
    process.exit(1)
  })
