const router = require('express').Router()
const userController = require('../controllers/recipes.js')

// get searched recipes
router.get('/:title', userController.getRecipeSearch)

module.exports = router
