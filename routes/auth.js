const router = require('express').Router()
const { checkToken, validateLogin } = require('../middlewares/loginValidation')
const authController = require('../controllers/login')

// UPDATE
router.post('/login', checkToken, validateLogin, authController.login)

module.exports = router
