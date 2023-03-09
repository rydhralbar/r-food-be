const router = require('express').Router()
const {
  validateCreateUser,
  validateEditUser,
  validateUser
} = require('../middlewares/usersValidation.js')
const { validateToken } = require('../middlewares/webtoken')
const userController = require('../controllers/users.js')
const { useRedis } = require('../middlewares/redis')

// create user
router.post('/add', validateCreateUser, userController.createUser)

// get user
router.get('/:id?', validateToken, userController.getUsers)

// edit user
router.patch(
  '/:id',
  validateToken,
  validateEditUser,
  validateUser,
  userController.editUser
)

// delete user
router.delete('/:id', validateToken, validateUser, userController.deleteUser)

module.exports = router
