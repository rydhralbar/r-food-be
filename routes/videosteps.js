const router = require('express').Router()
const { validateCreateVideo, validateEditVideo } = require('../middlewares/validation')
const userController = require('../controllers/videosteps')

// create video
router.post('', validateCreateVideo, userController.createVideo)

// get video
router.get('/:id?', userController.getVideo)

// edit video
router.patch('/:id', validateEditVideo, userController.editVideo)

// delete video
router.delete('/:id', userController.deleteVideo)

module.exports = router
