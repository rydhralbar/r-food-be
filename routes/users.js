const router = require('express').Router()
const {
  validateCreateUser,
  validateEditUser,
  validateUser
} = require('../middlewares/usersValidation.js')
const { validateToken } = require('../middlewares/webtoken')
const userController = require('../controllers/users.js')
const { useRedis } = require('../middlewares/redis')

router.post('/add', validateCreateUser, userController.createUser)

router.get('/:id?', validateToken, useRedis, userController.getUsers)

router.patch(
  '/:id',
  validateToken,
  validateEditUser,
  validateUser,
  userController.editUser
)

router.delete('/:id', validateToken, validateUser, userController.deleteUser)

module.exports = router
