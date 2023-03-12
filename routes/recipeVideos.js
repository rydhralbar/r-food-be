const router = require('express').Router()
const {
  validateCreateVideo,
  validateEditVideo
} = require('../middlewares/usersValidation')
const videoController = require('../controllers/recipeVideos')
const { validateToken } = require('../middlewares/webtoken')
const { validateUser } = require('../middlewares/videoValidation')

router.post('/', validateToken, validateUser, videoController.createNewVideo)

router.get('/:id?', videoController.getVideos)

router.patch('/:id', validateToken, validateUser, videoController.editVideo)

router.delete('/:id', validateToken, validateUser, videoController.deleteVideo)

module.exports = router
