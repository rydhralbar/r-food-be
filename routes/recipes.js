const router = require('express').Router()
const { validateCreateRecipe, validateEditRecipe } = require('../middlewares/validation.js')
const userController = require('../controllers/recipes.js')

// create recipe
router.post('', validateCreateRecipe, userController.createRecipe)

// get recipes
router.get('/:id?', userController.getRecipes)

// edit recipe
router.patch('/:id', validateEditRecipe, userController.editRecipe)

// delete recipe
router.delete('/:id', userController.deleteRecipe)

// get searched recipes
// router.get('/:title', userController.getRecipeSearch)

module.exports = router
