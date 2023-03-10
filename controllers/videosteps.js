const videos = require('../models/recipeVideos.js')

const createVideo = async (req, res) => {
  try {
    const { videoStep1, videoStep2, videoStep3, recipeId } = req.body

    const checkRecipeId = await videos.checkRecipeId({ recipeId })

    if (checkRecipeId.length === 0) {
      throw new Error({ code: 401, message: 'Recipe ID not registered' })
    }
    // INSERT INTO videoStep_recipe (videoStep1, videoStep2, videoStep3, videoStep4) VALUES ("")
    const addToDb = await videos.createVideo({
      videoStep1,
      videoStep2,
      videoStep3,
      recipeId
    })

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

    if (sort === 'id') {
      getAllVideos = await videos.getSortVideoId()
    } else {
      getAllVideos = await videos.getVideos()
    }

    if (id) {
      const getSelectedVideo = await videos.getVideoById({ id })

      if (getSelectedVideo.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getSelectedVideo
        })
      } else {
        throw new Error('DATA IS EMPTY, PLEASE TRY AGAIN')
      }
    } else {
      if (getAllVideos.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getAllVideos
        })
      } else {
        throw new Error('Data is empty, please try again')
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
    const {
      videoStep1,
      videoStep2,
      videoStep3,
      videoStep4,
      videoStep5,
      recipeId
    } = req.body

    const checkVideoId = await videos.checkVideoId({ id })

    if (checkVideoId.length >= 1) {
      if (recipeId) {
        const checkRecipeId = await videos.checkRecipeId({ recipeId })

        if (checkRecipeId.length >= 1) {
          throw new Error({ code: 404, message: 'Recipe ID cannot be changed' })
        }
      }
    } else {
      throw new Error({ code: 401, message: 'ID not registered' })
    }

    const getVideos = await videos.getVideos()

    if (getVideos) {
      // EDIT DATA AT videoStep_recipe (videoStep1, videoStep2, videoStep3) VALUES ("")
      await videos.editVideo({
        id,
        videoStep1,
        videoStep2,
        videoStep3,
        videoStep4,
        videoStep5,
        getVideos,
        recipeId
      })
    } else {
      throw new Error('ID not registered')
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
      throw new Error({ code: 401, message: 'Data is empty' })
    }
    await videos.deleteVideo({ id })

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

module.exports = { createVideo, getVideo, editVideo, deleteVideo }
