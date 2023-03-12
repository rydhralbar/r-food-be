const db = require('../db')

const createdAt = new Date()
const updatedAt = new Date()

const createNewRecipe = async (params) => {
  const { userId, title, description, ingredients, photo } = params
  return await db`INSERT INTO recipes (user_id, title, description, ingredients, photo, created_at, updated_at) VALUES(${userId}, ${title}, ${description}, ${ingredients}, ${photo}, ${createdAt}, ${updatedAt}) RETURNING id`
}

const getRecipes = async (params) => {
  const { title, id, userId, limit, page, sort, typeSort } = params

  if (title) {
    return await db`SELECT * FROM recipes WHERE title = ${title}`
  }

  if (id) {
    return await db`SELECT recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id WHERE recipes.id = ${id}`
  }

  if (userId) {
    if (sort) {
      return typeSort && typeSort === 'desc'
        ? await db`SELECT (
      SELECT COUNT(*)
      FROM   recipes
      ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id WHERE recipes.user_id = ${userId} ORDER BY ${db(
            sort
          )} DESC LIMIT ${limit ?? null} OFFSET ${
            page ? limit * (page - 1) : 0
          }`
        : await db`SELECT (
      SELECT COUNT(*)
      FROM   recipes
      ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id WHERE recipes.user_id = ${userId} ORDER BY ${db(
            sort
          )} ASC LIMIT ${limit ?? null} OFFSET ${page ? limit * (page - 1) : 0}`
    } else {
      return await db`SELECT (
      SELECT COUNT(*)
      FROM   recipes
      ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id WHERE recipes.user_id = ${userId} LIMIT ${
        limit ?? null
      } OFFSET ${page ? limit * (page - 1) : 0}`
    }
  }

  if (sort) {
    return typeSort && typeSort === 'desc'
      ? await db`SELECT (
      SELECT COUNT(*)
      FROM recipes
      ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id ORDER BY recipes.${db(
        sort
      )} DESC LIMIT ${limit ?? null} OFFSET ${page ? limit * (page - 1) : 0}`
      : await db`SELECT (
      SELECT COUNT(*)
      FROM   recipes
      ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id ORDER BY recipes.${db(
        sort
      )} ASC LIMIT ${limit ?? null} OFFSET ${page ? limit * (page - 1) : 0}`
  } else {
    return await db`SELECT (
      SELECT COUNT(*)
      FROM   recipes
      ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id LIMIT ${
        limit ?? null
      } OFFSET ${page ? limit * (page - 1) : 0}`
  }
}

const getSearchedRecipes = async (params) => {
  const { searchBy, keyword, limit, page, sort, typeSort } = params
  if (sort) {
    return typeSort && typeSort === 'desc'
      ? await db`SELECT (
        SELECT COUNT(*)
        FROM recipes WHERE ${db(`recipes.${searchBy}`)} ILIKE ${
          '%' + keyword + '%'
        }
        ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id WHERE ${db(
          `recipes.${searchBy}`
        )} ILIKE ${'%' + keyword + '%'} ORDER BY ${db(sort)} DESC LIMIT ${
          limit ?? null
        } OFFSET ${page ? limit * (page - 1) : 0}`
      : await db`SELECT (
        SELECT COUNT(*)
        FROM recipes WHERE ${db(`recipes.${searchBy}`)} ILIKE ${
          '%' + keyword + '%'
        }
        ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id WHERE ${db(
          `recipes.${searchBy}`
        )} ILIKE ${'%' + keyword + '%'} ORDER BY ${db(sort)} ASC LIMIT ${
          limit ?? null
        } OFFSET ${page ? limit * (page - 1) : 0}`
  } else {
    return await db`SELECT (
      SELECT COUNT(*)
      FROM recipes WHERE ${db(`recipes.${searchBy}`)} ILIKE ${
      '%' + keyword + '%'
    }
      ) AS total_recipes, recipes.*, users.name as user_name, users.email as user_email FROM recipes LEFT JOIN users ON users.id = recipes.user_id WHERE ${db(
        `recipes.${searchBy}`
      )} ILIKE ${'%' + keyword + '%'} LIMIT ${limit ?? null} OFFSET ${
      page ? limit * (page - 1) : 0
    }`
  }
}

const editRecipe = async (params) => {
  const { id, title, description, ingredients, photo } = params
  return await db`UPDATE recipes SET "title"=${title}, "description"=${description}, "ingredients"=${ingredients}, "photo"=${photo}, "updated_at"=${updatedAt} WHERE id=${id} RETURNING *`
}

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

const checkId = async (params) => {
  const { id } = params

  return await db`SELECT id FROM food_recipe WHERE id = ${id}`
}

const deleteRecipe = async (params) => {
  const { id } = params

  return await db`DELETE FROM recipes WHERE id=${id}`
}

const getRecipeSearchAsc = async (params) => {
  const { title } = params

  return await db`SELECT * FROM food_recipe WHERE LOWER (title) LIKE LOWER (${
    '%' + title + '%'
  }) ORDER BY title ASC`
}

const getRecipeSearchDesc = async (params) => {
  const { title } = params

  return await db`SELECT * FROM food_recipe WHERE LOWER (title) LIKE LOWER (${
    '%' + title + '%'
  }) ORDER BY title DESC`
}

const getRecipeSortId = async () => {
  return await db`SELECT * FROM food_recipe ORDER BY id ASC`
}

const getCountRecipe = async () => {
  return await db`SELECT COUNT(id) FROM food_recipe`
}

module.exports = {
  createNewRecipe,
  getRecipes,
  getSearchedRecipes,
  editRecipe,
  getRecipeById,
  deleteRecipe,
  getRecipeSearchAsc,
  getRecipeSearchDesc,
  getRecipeSortId,
  checkId,
  getRecipePagin,
  getCountRecipe
}
