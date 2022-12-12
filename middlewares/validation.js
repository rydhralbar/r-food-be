const { Validator, addCustomMessages, extend } = require('node-input-validator')

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
   })

   rules.check().then(function (success) {
      if (success) {
         next()
      } else {
         res.status(400).json({
            status: false,
            message: rules.errors,
            data: [],
         })
      }
   })
}

const validateEditUser = (req, res, next) => {
   addCustomMessages({
      'name.required': 'Required',
      'name.minLength': 'Name too short',
      // 'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
   })

   const rules = new Validator(req.body, {
      name: 'minLength:5|maxLength:50',
      email: 'minLength:5|maxLength:70|email',
      phone: 'minLength:11|maxLength:14|phoneNumber',
      password: 'minLength:8|alphaNumeric',
      photo: 'url',
   })

   rules.check().then(function (success) {
      if (success) {
         next()
      } else {
         res.status(400).json({
            status: false,
            message: rules.errors,
            data: [],
         })
      }
   })
}

const validateCreateRecipe = (req, res, next) => {
   const rules = new Validator(req.body, {
      photo: 'url',
      title: 'required|minLength:3|maxLength:70',
      ingredients: 'required|minLength:3',
   })

   rules.check().then(function (success) {
      if (success) {
         next()
      } else {
         res.status(400).json({
            status: false,
            message: rules.errors,
            data: [],
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
      ingredients: 'minLength:3',
   })

   rules.check().then(function (success) {
      if (success) {
         next()
      } else {
         res.status(400).json({
            status: false,
            message: rules.errors,
            data: [],
         })
      }
   })
}

const validateCreateComment = (req, res, next) => {
   const rules = new Validator(req.body, {
      comment: 'required|minLength:5|maxLength:50',
      user_id: 'required|minLength:1',
      recipe_id: 'required|minLength:1',
   })

   rules.check().then(function (success) {
      if (success) {
         next()
      } else {
         res.status(400).json({
            status: false,
            message: rules.errors,
            data: [],
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
      user_id: 'minLength:1',
      recipe_id: 'minLength:1',
   })

   rules.check().then(function (success) {
      if (success) {
         next()
      } else {
         res.status(400).json({
            status: false,
            message: rules.errors,
            data: [],
         })
      }
   })
}

const validateCreateVideo = (req, res, next) => {
   const rules = new Validator(req.body, {
      video_step1: 'required',
      video_step2: 'required',
      video_step3: 'required',
      video_step4: 'nullable',
      video_step5: 'nullable',
      recipe_id: 'required|minLength:1',
   })

   // const rules = new Validator(req.body, {
   //   video_step1: 'required|mime:mp4',
   //   video_step2: 'required|mime:mp4',
   //   video_step3: 'required|mime:mp4',
   //   video_step4: 'mime:mp4',
   //   video_step5: 'mime:mp4'
   // })

   rules.check().then(function (success) {
      if (success) {
         next()
      } else {
         res.status(400).json({
            status: false,
            message: rules.errors,
            data: [],
         })
      }
   })
}

const validateEditVideo = (req, res, next) => {
   const rules = new Validator(req.body, {
      video_step1: 'nullable',
      video_step2: 'nullable',
      video_step3: 'nullable',
      video_step4: 'nullable',
      video_step5: 'nullable',
      recipe_id: 'nullable',
   })

   rules.check().then(function (success) {
      if (success) {
         next()
      } else {
         res.status(400).json({
            status: false,
            message: rules.errors,
            data: [],
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
   validateEditVideo
}
