const router = require('express').Router()
const { validateCreateUser, validateEditUser } = require('../middlewares/validation.js')
const { validateToken } = require('../middlewares/webtoken')
const userController = require('../controllers/users.js')
const { useRedis } = require('../middlewares/redis')

// create user
router.post('', useRedis, validateCreateUser, userController.createUser)

// get user
router.get('/:id?', validateToken, userController.getUsers)

// edit user
router.patch('/:id', validateEditUser, userController.editUser)

// delete user
router.delete('/:id', userController.deleteUser)

module.exports = router
