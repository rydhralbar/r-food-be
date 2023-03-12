const { Validator } = require('node-input-validator')
const jwt = require('jsonwebtoken')
const db = require('../db')

const validateUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers

    const { id } = req.params

    const decoded = jwt.verify(
      authorization.replace('Bearer ', ''),
      process.env.JWT_KEY
    )

    const userIdToken = decoded?.data?.id

    const data = await db`SELECT * FROM users WHERE id=${id}`

    if (userIdToken === data[0]?.id) {
      next()
    } else {
      throw { code: 401, message: 'You are not allowed!' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? 'There is a problem with your token!'
    })
  }
}

const validateCreateUser = (req, res, next) => {
  const rules = new Validator(req.body, {
    name: 'required|regex:^[a-zA-Z_ ]+$|minLength:5|maxLength:50',
    email: 'required|email|minLength:5|maxLength:70|email',
    phone: 'required|phoneNumber|minLength:11|maxLength:14|phoneNumber',
    password: 'required|minLength:8|regex:[0-9]'
  })

  rules.check().then((success) => {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.name?.message ??
          rules.errors?.email?.message ??
          rules.errors?.phone?.message ??
          rules.errors?.password?.message,
        data: []
      })
    }
  })
}

const validateEditUser = (req, res, next) => {
  const rules = new Validator(req.body, {
    name: 'minLength:5|maxLength:40',
    email: 'email|minLength:5|maxLength:70|email',
    phone: 'phoneNumber|minLength:11|maxLength:14|phoneNumber',
    password: 'minLength:8|alphaNumeric'
  })

  rules.check().then((success) => {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.name?.message ??
          rules.errors?.email?.message ??
          rules.errors?.phone?.message ??
          rules.errors?.password?.message,
        data: []
      })
    }
  })
}

module.exports = {
  validateUser,
  validateCreateUser,
  validateEditUser
}
