const { Validator, addCustomMessages } = require('node-input-validator')
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
      throw { statusCode: 401, message: 'You are not allowed!' }
    }
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
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
    password: 'required|minLength:8|alphaNumeric'
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
    name: 'minLength:5|maxLength:40|required'
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

const validateCreateRecipe = (req, res, next) => {
  const rules = new Validator(req.body, {
    photo: 'url',
    title: 'required|minLength:3|maxLength:70',
    ingredients: 'required|minLength:3'
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: []
      })
    }
  })
}

const validateEditRecipe = (req, res, next) => {
  // addCustomMessages({
  //   'name.required': 'Required',
  //   'name.minLength': 'Name too short',
  //   // 'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
  // })

  const rules = new Validator(req.body, {
    photo: 'url',
    title: 'minLength:3|maxLength:70',
    ingredients: 'minLength:3'
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: []
      })
    }
  })
}

const validateCreateComment = (req, res, next) => {
  const rules = new Validator(req.body, {
    comment: 'required|minLength:5|maxLength:50',
    userId: 'required|minLength:1',
    recipeId: 'required|minLength:1'
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: []
      })
    }
  })
}

const validateEditComment = (req, res, next) => {
  // addCustomMessages({
  //   'name.required': 'Required',
  //   'name.minLength': 'Name too short',
  //   // 'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
  // })

  const rules = new Validator(req.body, {
    comment: 'minLength:5',
    userId: 'minLength:1',
    recipeId: 'minLength:1'
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: []
      })
    }
  })
}

const validateCreateVideo = (req, res, next) => {
  const rules = new Validator(req.body, {
    videoStep1: 'required',
    videoStep2: 'required',
    videoStep3: 'required',
    videoStep4: 'nullable',
    videoStep5: 'nullable',
    recipeId: 'required|minLength:1'
  })

  // const rules = new Validator(req.body, {
  //   videoStep1: 'required|mime:mp4',
  //   videoStep2: 'required|mime:mp4',
  //   videoStep3: 'required|mime:mp4',
  //   videoStep4: 'mime:mp4',
  //   videoStep5: 'mime:mp4'
  // })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: []
      })
    }
  })
}

const validateEditVideo = (req, res, next) => {
  const rules = new Validator(req.body, {
    videoStep1: 'nullable',
    videoStep2: 'nullable',
    videoStep3: 'nullable',
    videoStep4: 'nullable',
    videoStep5: 'nullable',
    recipeId: 'nullable'
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: []
      })
    }
  })
}

module.exports = {
  validateUser,
  validateCreateUser,
  validateEditUser,
  validateCreateRecipe,
  validateEditRecipe,
  validateCreateComment,
  validateEditComment,
  validateCreateVideo,
  validateEditVideo
}
