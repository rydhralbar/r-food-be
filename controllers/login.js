require('dotenv').config()
const bcrypt = require('bcrypt')
const accounts = require('../models/accounts')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const checkEmail = await accounts.getUserByEmail({ email })

    if (checkEmail?.length === 0) {
      throw 'Unregistered email'
    }

    bcrypt.compare(password, checkEmail[0].password, (err, result) => {
      try {
        if (err) {
          throw { code: 500, message: 'There was an error on the server' }
        }

        const token = jwt.sign(
          {
            id: checkEmail[0]?.id,
            name: checkEmail[0]?.name,
            email: checkEmail[0]?.email,
            iat: new Date().getTime(),
          },
          process.env.JWT_KEY,
          // { expiresIn: '1d' }
        )

        if (result) {
          res.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
              token,
            },
          })
        } else {
          throw { code: 400, message: 'Login failed, wrong password' }
        }
      } catch (error) {
        res.status(error?.code ?? 500).json({
          status: false,
          message: error?.message ?? error,
          data: [],
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

module.exports = { login }
