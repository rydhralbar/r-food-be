require('dotenv').config()
const bcrypt = require('bcrypt')
const users = require('../models/users')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const checkEmail = await users.getUserByEmail({ email })

    if (checkEmail?.length === 0) {
      throw { code: 400, message: 'Unregistered email' }
    }

    bcrypt.compare(password, checkEmail[0].password, (err, result) => {
      try {
        if (err) {
          throw { code: 500, message: 'There was an error on the server' }
        }

        const token = jwt.sign(
          {
            data: checkEmail[0]
          },
          process.env.JWT_KEY
          // { expiresIn: '2h' }
        )

        if (result) {
          res.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
              token,
              profile: checkEmail[0]
            }
          })
        } else {
          throw { code: 400, message: 'Login failed, wrong password' }
        }
      } catch (error) {
        res.status(error?.code ?? 500).json({
          status: false,
          message: error?.message ?? error,
          data: []
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = { login }
