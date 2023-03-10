const { Validator, addCustomMessages } = require('node-input-validator')
const jwt = require('jsonwebtoken')
const db = require('../db')

const validateCreateRecipe = (req, res, next) => {
  const rules = new Validator(req.body, {
    title: 'required|minLength:3|maxLength:50',
    ingredients: 'required|minLength:3',
    video: 'required',
    description: 'required|minLength:10'
  })

  rules.check().then((success) => {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.title?.message ??
          rules.errors?.ingredients?.message ??
          rules.errors?.video?.message ??
          rules.errors?.description?.message,
        data: []
      })
    }
  })
}

const validateSearchRecipe = async (req, res, next) => {
  const rules = new Validator(req.query, {
    keyword: 'required',
    searchBy: 'required'
  })

  rules.check().then((success) => {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.keyword?.message ?? rules.errors?.searchBy?.message,
        data: []
      })
    }
  })
}

const validateUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers

    const { id } = req.params

    const decoded = jwt.verify(
      authorization.replace('Bearer ', ''),
      process.env.JWT_KEY
    )

    const userIdToken = decoded?.data?.id

    const data = await db`SELECT * FROM recipes WHERE id=${id}`

    if (userIdToken === data[0]?.user_id) {
      next()
    } else {
      throw { statusCode: 401, message: 'You are not allowed!' }
    }
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? 'There is a problem with your token!'
    })
  }
}

module.exports = { validateCreateRecipe, validateSearchRecipe, validateUser }
