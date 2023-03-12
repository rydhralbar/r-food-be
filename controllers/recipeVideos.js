const videos = require('../models/recipeVideos')
const recipes = require('../models/recipes')
const jwt = require('jsonwebtoken')

const getUserId = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_KEY)
  return decoded?.data?.id
}

const createNewVideo = async (req, res) => {
  try {
    const { recipeId, video } = req.body
    const { authorization } = req.headers

    const userId = getUserId(authorization.replace('Bearer ', ''))

    const checkRecipes = await recipes.getRecipes({ id: recipeId })

    if (userId !== checkRecipes[0]?.user_id) {
      throw { statusCode: 401, message: 'User not allowed!' }
    }

    if (checkRecipes.length < 1) {
      throw { statusCode: 400, message: 'Recipe ID doesnt exist!' }
    }

    await videos.createVideo({
      videos: { recipe_id: recipeId, video }
    })

    res.status(200).json({
      status: true,
      message: 'Recipe video created successful!',
      data: []
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const getVideos = async (req, res) => {
  try {
    const code = 200
    let message
    let video = []

    const { id } = req.params
    const { recipeId, limit, page, sort, typeSort } = req.query

    if (id) {
      video = await videos.getVideos({ id })
    } else if (recipeId) {
      video = await videos.getVideos({
        recipeId,
        limit,
        page,
        sort,
        typeSort
      })
    } else {
      video = await videos.getVideos({ limit, page, sort, typeSort })
    }

    if (videos.length < 1) {
      message = 'Data not found!'
    }

    res.status(code ?? 200).json({
      status: true,
      message: message ?? 'Data retrieved successfully !',
      sort: sort ?? null,
      typeSort: typeSort ?? null,
      page: parseInt(page) ?? 1,
      limit: parseInt(limit) ?? null,
      total: video.length,
      data: video
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const editVideo = async (req, res) => {
  try {
    const { id } = req.params
    const { video } = req.body
    const { authorization } = req.headers

    const userId = getUserId(authorization.replace('Bearer ', ''))

    const getVideos = await videos.getVideos({ id })

    if (userId !== getVideos[0]?.user_id) {
      throw { statusCode: 401, message: 'You are not allowed!' }
    }

    if (getVideos.length < 1) {
      throw { statusCode: 400, message: 'Data not found !' }
    }

    await videos.editVideo({
      id,
      video: video ?? getVideos[0].video
    })

    res.status(200).json({
      status: true,
      message: 'Data updated successfully !'
    })
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error
    })
  }
}

const deleteVideo = async (params) => {
  try {
    const { id } = req.params
    const { recipeId } = req.query
    const { authorization } = req.headers

    const userId = getUserId(authorization.replace('Bearer ', ''))

    const getVideos = await videos.getVideos({ id, recipeId })

    if (userId !== getVideos[0]?.user_id) {
      throw { statusCode: 401, message: 'User not allowed!' }
    }

    if (getVideos < 1) {
      throw { statusCode: 400, message: 'Data doesnt exist!' }
    } else {
      await videos.deleteVideo({ id, recipeId })
    }

    res.status(200).json({
      status: true,
      message: 'Data deleted successfully !'
    })
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error
    })
  }
}

module.exports = { createNewVideo, getVideos, editVideo, deleteVideo }
