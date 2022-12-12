const db = require('../db') // import dari file ./db.js

const createComment = async (params) => {
   const { comment, user_id, recipe_id } = params

   return await db`
  INSERT INTO comment_recipe (comment, user_id, recipe_id) 
  VALUES (${comment}, ${user_id}, ${recipe_id})
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
   const { user_id } = params

   return await db`SELECT id FROM account_user WHERE id = ${user_id}`
}

const checkRecipeComment = async (params) => {
   const { recipe_id } = params

   return await db`SELECT id FROM food_recipe WHERE id = ${recipe_id}`
}

const editComment = async (params) => {
   const { id, comment, user_id, recipe_id, getComments } = params

   return await db`
   UPDATE comment_recipe SET 
   "comment" = ${comment || getComments[0]?.comment},
   "user_id" = ${user_id || getComments[0]?.user_id},
   "recipe_id" = ${recipe_id || getComments[0]?.recipe_id}
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
