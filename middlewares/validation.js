const { Validator, addCustomMessages } = require('node-input-validator')

const validateCreateUser = (req, res, next) => {
  // extend('nameNotContainPassword', ({ value }) => {
  //   if (req.body.name !== req.body.password) {
  //     return true
  //   }
  //   return false
  // })

  // addCustomMessages({
  //   'name.required': 'Name '
  //   'name.minLength': 'Name too short',
  //   'email.required': 'Email is required'
  //   // 'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
  // })

  const rules = new Validator(req.body, {
    name: 'required|minLength:5|maxLength:50',
    email: 'required|minLength:5|maxLength:70|email',
    phone: 'required|minLength:11|maxLength:14|phoneNumber',
    password: 'required|minLength:8|alphaNumeric',
    photo: 'nullable'
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

const validateEditUser = (req, res, next) => {
  addCustomMessages({
    'name.required': 'Required',
    'name.minLength': 'Name too short'
    // 'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
  })

  const rules = new Validator(req.body, {
    name: 'minLength:5|maxLength:50',
    email: 'minLength:5|maxLength:70|email',
    phone: 'minLength:11|maxLength:14|phoneNumber',
    password: 'minLength:8|alphaNumeric',
    photo: 'url'
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

const validateLogin = (req, res, next) => {
  const rules = new Validator(req.body, {
    email: 'required|email',
    password: 'required'
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
  validateCreateUser,
  validateEditUser,
  validateCreateRecipe,
  validateEditRecipe,
  validateCreateComment,
  validateEditComment,
  validateCreateVideo,
  validateEditVideo,
  validateLogin
}
