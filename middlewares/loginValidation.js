require('dotenv').config()
const jwt = require('jsonwebtoken')
const { Validator } = require('node-input-validator')

const checkToken = async (req, res, next) => {
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

          if (Date.now() >= decoded.exp * 1000) {
            throw {
              code: 401,
              message: 'Token expired, please re-login!'
            }
          }

          res.status(200).json({
            status: true,
            message: 'Your account has been logged !',
            token: authorization.replace('Bearer ', '')
          })
        }
      )
    } else {
      next()
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const validateLogin = (req, res, next) => {
  const rules = new Validator(req.body, {
    email: 'required|email',
    password: 'required'
  })

  rules.check().then((success) => {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.email?.message ?? rules.errors?.password?.message,
        data: []
      })
    }
  })
}

module.exports = { checkToken, validateLogin }
