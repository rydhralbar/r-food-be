const { Validator } = require('node-input-validator')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const db = require('../db')

const validateCreateVideo = async (req, res, next) => {
  const rules = new Validator(req.body, {
    recipeId: 'required',
    video: 'required'
  })

  rules.check().then((success) => {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.recipeId?.message ?? rules.errors?.video?.message,
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

    const data =
      await db`SELECT recipes.user_id as user_id FROM recipe_videos LEFT JOIN recipes ON recipes.id = recipe_videos.recipe_id WHERE recipe_videos.id=${id}`

    if (userIdToken === data[0]?.user_id) {
      next()
    } else {
      throw { statusCode: 401, message: 'You are not allowed!' }
    }
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? `Token error, please try again!`
    })
  }
}

module.exports = { validateCreateVideo, validateUser }
