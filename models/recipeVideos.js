const db = require('../db')

const createVideo = async (params) => {
  const { videos } = params
  return await db`INSERT INTO recipe_videos ${db(videos, 'recipe_id', 'video')}`
}

const getVideos = async (params) => {
  const { id, recipeId, limit, page, sort, typeSort } = params

  if (id) {
    return await db`SELECT recipe_videos.*, recipes.* FROM recipe_videos LEFT JOIN recipes ON recipes.id = recipe_videos.recipe_id WHERE recipe_videos.id = ${id}`
  }

  if (recipeId) {
    if (sort) {
      return typeSort && typeSort === 'desc'
        ? await db`SELECT recipe_videos.*, recipes.* FROM recipe_videos LEFT JOIN recipes ON recipes.id = recipe_videos.recipe_id WHERE recipe_videos.id = ${recipeId} ORDER BY ${db(
            sort
          )} DESC LIMIT ${limit ?? null} OFFSET ${
            page ? limit * (page - 1) : 0
          }`
        : await db`SELECT recipe_videos.*, recipes.* FROM recipe_videos LEFT JOIN recipes ON recipes.id = recipe_videos.recipe_id WHERE recipe_videos.id = ${recipeId} ORDER BY ${db(
            sort
          )} ASC LIMIT ${limit ?? null} OFFSET ${page ? limit * (page - 1) : 0}`
    } else {
      return await db`SELECT recipe_videos.*, recipes.* FROM recipe_videos LEFT JOIN recipes ON recipes.id = recipe_videos.recipe_id WHERE recipe_videos.id = ${recipeId} LIMIT ${
        limit ?? null
      } OFFSET ${page ? limit * (page - 1) : 0}`
    }
  }

  if (sort) {
    return typeSort && typeSort === 'desc'
      ? await db`SELECT * FROM recipe_videos ORDER BY ${db(sort)} DESC LIMIT ${
          limit ?? null
        } OFFSET ${page ? limit * (page - 1) : 0}`
      : await db`SELECT * FROM recipe_videos ORDER BY ${db(sort)} ASC LIMIT ${
          limit ?? null
        } OFFSET ${page ? limit * (page - 1) : 0}`
  } else {
    return await db`SELECT * FROM recipe_videos LIMIT ${limit ?? null} OFFSET ${
      page ? limit * (page - 1) : 0
    }`
  }
}

const editVideo = async (params) => {
  const { id, video } = params
  return await db`UPDATE recipe_videos SET "video"=${video} WHERE id=${id}`
}

const checkRecipeId = async (params) => {
  const { recipeId } = params

  return await db`SELECT id FROM food_recipe WHERE id = ${recipeId}`
}

const deleteVideo = async (params) => {
  const { id, recipeId } = params

  if (recipeId) {
    return await db`DELETE FROM recipe_videos WHERE recipe_id = ${recipeId}`
  } else {
    return await db`DELETE FROM recipe_videos WHERE id = ${id}`
  }
}

const getSortVideoId = async () => {
  return await db`SELECT * FROM video_step_recipe ORDER BY id ASC`
}

const checkVideoId = async (params) => {
  const { id } = params

  return await db`SELECT id FROM video_step_recipe WHERE id = ${id}`
}

module.exports = {
  createVideo,
  getVideos,
  editVideo,
  checkRecipeId,
  editVideo,
  deleteVideo,
  getSortVideoId,
  checkVideoId
}
