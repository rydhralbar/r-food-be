const videos = require('../models/videosteps.js')

const createVideo = async (req, res) => {
  try {
    const { video_step1, video_step2, video_step3, recipe_id } = req.body

    
      const checkRecipeId = await videos.checkRecipeId({ recipe_id })

      if (checkRecipeId.length === 0) {
         throw { code: 401, message: 'Recipe ID not registered' }
      }
    // INSERT INTO video_step_recipe (video_step1, video_step2, video_step3, video_step4) VALUES ("")
    const addToDb = await videos.createVideo({video_step1, video_step2, video_step3, recipe_id})

    res.json({
      status: true,
      message: 'Inserted successfully',
      data: addToDb
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const getVideo = async (req, res) => {
  try {
    const { id } = req.params
    const { sort } = req.query

    let getAllVideos

    if(sort === 'id'){
      getAllVideos = await videos.getSortVideoId()
    } else {
      getAllVideos = await videos.getVideos()
    }

    if (id) {
      const getSelectedVideo = await videos.getVideoById({id})

      if (getSelectedVideo.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getSelectedVideo
        })
      } else {
        throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
      }
    } else {
      if (getAllVideos.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getAllVideos
        })
      } else {
        throw 'Data is empty, please try again'
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const editVideo = async (req, res) => {
  try {
    const { id } = req.params
    const { video_step1, video_step2, video_step3, video_step4, video_step5, recipe_id } = req.body

    const checkVideoId = await videos.checkVideoId({id})

    if(checkVideoId.length >= 1){
      if(recipe_id){
        const checkRecipeId = await videos.checkRecipeId({recipe_id})
  
        if(checkRecipeId.length >= 1){
          throw {code: 404, message: 'Recipe ID cannot be changed'}
        }
      }
    } else {
      throw { code: 401, message: 'ID not registered'}
    }

    const getVideos = await videos.getVideos()

    if (getVideos) {
      // EDIT DATA AT video_step_recipe (video_step1, video_step2, video_step3) VALUES ("")
      await videos.editVideo({id, video_step1, video_step2, video_step3, video_step4, video_step5, getVideos, recipe_id})
    } else {
      throw 'ID not registered'
    }

    res.json({
      status: true,
      message: 'Edited successfully'
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params
    const checkId = await videos.getVideoById({ id })

    if (checkId.length === 0) {
       throw { code: 401, message: 'Data is empty' }
    }
    await videos.deleteVideo({id})

    res.json({
      status: true,
      message: 'Deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = {createVideo, getVideo, editVideo, deleteVideo}