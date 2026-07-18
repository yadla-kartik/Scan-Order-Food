const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET || 'scan-order-dev-secret'

function generateJWT(user) {
  return jwt.sign({
    _id: user._id,
    userName: user.fullname,
    mobileNo: user.mobileNo,
    role: user.role || 'customer',
  }, secretKey, { expiresIn: '7d' })
}

function validateToken(token) {
  return jwt.verify(token, secretKey)
}

module.exports = { generateJWT, validateToken }
