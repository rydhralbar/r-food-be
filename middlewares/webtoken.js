require('dotenv').config()
const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (authorization) {
      jwt.verify(
        authorization.replace('Bearer ', ''),
        process.env.JWT_KEY,
        (err, decoded) => {
          if (err) {
            throw { code: 401, message: 'Token error, please try again!' }
          }

          if (Date.now() >= decoded.exp) {
            throw { code: 401, message: 'Token expired, please re-login !' }
          }

          next()
        }
      )
    } else {
      throw { code: 401, message: 'No token provide' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = { validateToken }
