const router = require('express').Router()
const { validateCreateComment, validateEditComment } = require('../middlewares/validation.js')
const userController = require('../controllers/comments.js')

// create comment
router.post('', validateCreateComment, userController.createComment)

// get comment
router.get('/:id?', userController.getComments)

// edit comment
router.patch('/:id', validateEditComment, userController.editComment)

// delete comment
router.delete('/:id', userController.deleteComment)

module.exports = router
