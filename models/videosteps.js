const db = require('../db') // import dari file ./db.js

const createVideo = async (params) => {
  const {video_step1, video_step2, video_step3, recipe_id} = params

  return await db`INSERT INTO video_step_recipe (video_step1, video_step2, video_step3, recipe_id) 
  VALUES (${video_step1}, ${video_step2}, ${video_step3}, ${recipe_id})
`
}

const getVideoById = async (params) => {
  const {id} = params

  return await db`SELECT * FROM video_step_recipe WHERE id = ${id}`
}

const getVideos = async () => {

  return await db`SELECT * FROM video_step_recipe`
}

const checkRecipeId = async (params) => {
  const {recipe_id} = params

  return await db`SELECT id FROM food_recipe WHERE id = ${recipe_id}`
}

const editVideo = async (params) => {
  const {id, video_step1, video_step2, video_step3, video_step4, video_step5, getVideos, recipe_id} = params

  return await db`
        UPDATE video_step_recipe SET
          "video_step1" = ${video_step1 || getVideos[0]?.video_step1},
          "video_step2" = ${video_step2 || getVideos[0]?.video_step2},
          "video_step3" = ${video_step3 || getVideos[0]?.video_step3},
          "video_step4" = ${video_step4 || getVideos[0]?.video_step4},
          "video_step5" = ${video_step5 || getVideos[0]?.video_step5},
          "recipe_id" = ${recipe_id || getVideos[0]?.recipe_id}
          WHERE "id" = ${id};
      `
}

const deleteVideo = async (params) => {
  const { id } = params

   return await db`DELETE FROM "public"."video_step_recipe" WHERE "id" = ${id}`
}

const getSortVideoId = async () => {
  return await db`SELECT * FROM video_step_recipe ORDER BY id ASC`
} 

const checkVideoId = async (params) => {
  const {id} = params

  return await db`SELECT id FROM video_step_recipe WHERE id = ${id}`
}

module.exports = {createVideo, getVideoById, getVideos, checkRecipeId, editVideo, deleteVideo, getSortVideoId, checkVideoId}