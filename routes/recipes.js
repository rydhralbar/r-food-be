const router = require('express').Router()
const {
  validateCreateRecipe,
  validateEditRecipe
} = require('../middlewares/usersValidation.js')
const userController = require('../controllers/recipes.js')

// create recipe
router.post('/add', validateCreateRecipe, userController.createRecipe)

// get recipes
router.get('/:id?', userController.getRecipes)

// get search recipes
router.get('/search/:title', userController.getRecipeSearch)

// edit recipe
router.patch('/:id', validateEditRecipe, userController.editRecipe)

// delete recipe
router.delete('/:id', userController.deleteRecipe)

// get searched recipes
router.get('/search/name', userController.getRecipeSearch)

module.exports = router
