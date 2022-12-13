const db = require('../db') // import dari file ./db.js

const createComment = async (params) => {
  const { comment, userId, recipeId } = params

  return await db`
  INSERT INTO comment_recipe (comment, user_id, recipe_id) 
  VALUES (${comment}, ${userId}, ${recipeId})
`
}

const getAllComments = async () => {
  return await db`
  SELECT * FROM comment_recipe
`
}

const getCommentsById = async (params) => {
  const { id } = params

  return await db`
  SELECT * FROM comment_recipe WHERE id = ${id}
`
}

const checkUserComment = async (params) => {
  const { userId } = params

  return await db`SELECT id FROM account_user WHERE id = ${userId}`
}

const checkRecipeComment = async (params) => {
  const { recipeId } = params

  return await db`SELECT id FROM food_recipe WHERE id = ${recipeId}`
}

const editComment = async (params) => {
  const { id, comment, userId, recipeId, getComments } = params

  return await db`
   UPDATE comment_recipe SET 
   "comment" = ${comment || getComments[0]?.comment},
   "userId" = ${userId || getComments[0]?.userId},
   "recipeId" = ${recipeId || getComments[0]?.recipeId}
   WHERE id = ${id}
   `
}

const deleteComment = async (params) => {
  const { id } = params

  return await db`DELETE FROM "public"."comment_recipe" WHERE "id" = ${id}`
}

const getCommentsSortId = async () => {
  return await db`SELECT * FROM comment_recipe ORDER BY id ASC`
}

module.exports = {
  createComment,
  getAllComments,
  getCommentsById,
  checkUserComment,
  checkRecipeComment,
  editComment,
  deleteComment,
  getCommentsSortId
}
