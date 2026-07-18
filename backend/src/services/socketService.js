function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join', ({ role, userId } = {}) => {
      if (role === 'admin') socket.join('admin')
      if (role === 'chef') socket.join('chef')
      if (userId) socket.join(`user:${userId}`)
    })

    socket.on('leave', ({ role, userId } = {}) => {
      if (role === 'admin') socket.leave('admin')
      if (role === 'chef') socket.leave('chef')
      if (userId) socket.leave(`user:${userId}`)
    })
  })
}

module.exports = { registerSocketHandlers }
