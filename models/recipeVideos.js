const db = require('../db') // import dari file ./db.js

const createVideo = async (params) => {
  const { videos } = params
  return await db`INSERT INTO recipe_videos ${db(videos, 'recipe_id', 'video')}`
}

const getVideoById = async (params) => {
  const { id } = params

  return await db`SELECT * FROM video_step_recipe WHERE id = ${id}`
}

const getVideos = async (params) => {
  const { recipeId } = params

  return await db`SELECT * FROM recipe_videos WHERE recipe_id = ${recipeId}`
}

const checkRecipeId = async (params) => {
  const { recipeId } = params

  return await db`SELECT id FROM food_recipe WHERE id = ${recipeId}`
}

const editVideo = async (params) => {
  const {
    id,
    videoStep1,
    videoStep2,
    videoStep3,
    videoStep4,
    videoStep5,
    getVideos,
    recipeId
  } = params

  return await db`
        UPDATE video_step_recipe SET
          "videoStep1" = ${videoStep1 || getVideos[0]?.videoStep1},
          "videoStep2" = ${videoStep2 || getVideos[0]?.videoStep2},
          "videoStep3" = ${videoStep3 || getVideos[0]?.videoStep3},
          "videoStep4" = ${videoStep4 || getVideos[0]?.videoStep4},
          "videoStep5" = ${videoStep5 || getVideos[0]?.videoStep5},
          "recipeId" = ${recipeId || getVideos[0]?.recipeId}
          WHERE "id" = ${id};
      `
}

const deleteVideo = async (params) => {
  const { recipeId } = params

  return await db`DELETE FROM recipe_videos WHERE recipe_id = ${recipeId}`
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
  getVideoById,
  getVideos,
  checkRecipeId,
  editVideo,
  deleteVideo,
  getSortVideoId,
  checkVideoId
}
