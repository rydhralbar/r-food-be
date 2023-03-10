const router = require('express').Router()
const {
  validateCreateRecipe,
  validateSearchRecipe,
  validateUser
} = require('../middlewares/recipesValidation.js')
const recipeController = require('../controllers/recipes.js')
const { validateToken } = require('../middlewares/webtoken')
const { useRedis } = require('../middlewares/redis.js')

router.post(
  '/add',
  validateToken,
  validateCreateRecipe,
  recipeController.createRecipe
)

router.get('/:id?', useRedis, recipeController.getRecipes)

router.get(
  '/search/by',
  validateSearchRecipe,
  recipeController.getSearchedRecipes
)

router.patch('/:id', validateToken, validateUser, recipeController.editRecipe)

router.delete(
  '/:id',
  validateToken,
  validateUser,
  recipeController.deleteRecipe
)

module.exports = router
