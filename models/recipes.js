const db = require('../db') // import from file db.js

// create recipe to db
const createNewRecipe = async (params) => {
  const { title, ingredients, slug } = params

  return await db`
     INSERT INTO food_recipe (title, ingredients, slug) 
     VALUES (${title}, ${ingredients}, ${slug})
   `
}

const createNewRecipePhoto = async (params) => {
  const { title, photo, ingredients, slug} = params

  return await db`
  INSERT INTO food_recipe (title, photo, ingredients, slug) 
  VALUES (${title}, ${photo}, ${ingredients}, ${slug})
`
}

// get recipe from db
const getAllRecipes = async () => {
  return await db`
     SELECT * FROM food_recipe`
}

// edit recipe data
const editRecipe = async (params) => {
  const { id, photo, title, ingredients, getRecipes } = params

  return await db`
  UPDATE food_recipe SET
    "photo" = ${photo || getRecipes[0]?.photo},
    "title" = ${title || getRecipes[0]?.title},
    "ingredients" = ${ingredients || getRecipes[0]?.ingredients}
    WHERE "id" = ${id};
`
}

// get recipe by id
const getRecipeById = async (params) => {
  const { id } = params

  return await db`
     SELECT * FROM food_recipe WHERE slug = ${id}
   `
}

const getRecipePagin = async (params) => {
  const { page, limit } = params

  return await db`SELECT * FROM food_recipe LIMIT ${limit} OFFSET ${
      limit * (page - 1)
   }`
}

// const getPaginLimit = async (params) => {
//   const { limit } = params

//   return await db`SELECT * FROM food_recipe LIMIT ${limit}`
// }

// check recipe id
const checkId = async (params) => {
  const { id } = params

  return await db`SELECT id FROM food_recipe WHERE id = ${id}`
}

// get recipe sort name by asc
const getRecipeSortNameAsc = async () => {
  return await db`SELECT * FROM food_recipe ORDER BY title ASC`
}

// get recipe sort name by desc
const getRecipeSortNameDesc = async () => {
  return await db`SELECT * FROM food_recipe ORDER BY title DESC`
}

// get recipe sort created at by asc
const getRecipeSortCreatedAsc = async () => {
  return await db`SELECT * FROM food_recipe ORDER BY created_at ASC`
}

// get recipe sort created at by desc
const getRecipeSortCreatedDesc = async () => {
  return await db`SELECT * FROM food_recipe ORDER BY created_at DESC`
}

// delete recipe
const deleteRecipe = async (params) => {
  const { id } = params

  return await db`DELETE FROM "public"."food_recipe" WHERE "id" = ${id}`
}

// get searched recipe sort by title search
const getRecipeSearchAsc = async (params) => {
  const { title } = params

  return await db`SELECT * FROM food_recipe WHERE LOWER (title) LIKE LOWER (${'%' + title + '%'}) ORDER BY title ASC`
}

// get searched recipe sort by title search
const getRecipeSearchDesc = async (params) => {
  const { title } = params

  return await db`SELECT * FROM food_recipe WHERE LOWER (title) LIKE LOWER (${'%' + title + '%'}) ORDER BY title DESC`
}

// get searched recipe
const getRecipeSearch = async (params) => {
  const { title } = params

  return await db`SELECT * FROM food_recipe WHERE LOWER (title) LIKE LOWER (${'%' + title + '%'})`
}

const getRecipeSortId = async () => {
  return await db`SELECT * FROM food_recipe ORDER BY id ASC`
}

const getCountRecipe = async () => {
  return await db`SELECT COUNT(id) FROM food_recipe`
}

module.exports = {
  createNewRecipe,
  createNewRecipePhoto,
  getAllRecipes,
  editRecipe,
  getRecipeById,
  getRecipeSortNameAsc,
  getRecipeSortNameDesc,
  getRecipeSortCreatedAsc,
  getRecipeSortCreatedDesc,
  deleteRecipe,
  getRecipeSearchAsc,
  getRecipeSearchDesc,
  getRecipeSearch,
  getRecipeSortId,
  checkId,
  getRecipePagin,
  // getPaginLimit,
  getCountRecipe
}
