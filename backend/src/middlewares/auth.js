const { validateToken } = require('../services/authService')

function attachUser(req, res, next) {
  const token = req.cookies?.userToken || req.headers.authorization?.replace('Bearer ', '')

  if (!token) return next()

  try {
    req.user = validateToken(token)
  } catch (error) {
    req.user = null
  }

  next()
}

function requireAuth(req, res, next) {
  attachUser(req, res, () => {
    if (!req.user) {
      if (req.path.startsWith('/api')) {
        return res.status(401).json({ success: false, message: 'Login required' })
      }
      return res.redirect('/user')
    }
    next()
  })
}

module.exports = { attachUser, requireAuth }
