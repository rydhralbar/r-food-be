const recipes = require('../models/recipes')
const users = require('../models/users')
const recipeVideos = require('../models/recipeVideos')
// const db = require('../db') // import dari file ./db.js
// const { cloudinary } = require('../helper')
const { connect } = require('../middlewares/redis')
const { v4: uuidv4 } = require('uuid')
const { decodeToken } = require('../utils/jwtToken')
const { uploadCloudinary, deleteCloudinary } = require('../utils/cloudinary')
const { checkSizeUpload, checkExtensionFile } = require('../utils/uploadFile')

const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, video, description } = req.body

    const { authorization } = req.headers

    const decoded = decodeToken(authorization)

    const userIdToken = decoded?.data?.id

    const checkUser = await users.getUsers({ id: userIdToken })

    if (checkUser.length === 0) {
      throw {
        code: 400,
        message: `User with id ${userIdToken} does not exist`
      }
    }

    const checkRecipe = await recipes.getRecipes({ title })

    if (checkRecipe.length > 0) {
      throw {
        code: 400,
        message: `A recipe with the title ${title} already exists`
      }
    }

    let file = req.files.photo

    if (file) {
      const checkSize = checkSizeUpload(file)
      if (!checkSize) {
        throw {
          code: 400,
          message: 'File upload is too large! only support < 1 MB'
        }
      }

      const allowedFile = checkExtensionFile(file)
      if (!allowedFile) {
        throw {
          code: 400,
          message: `File is not support! format file must be image`
        }
      }

      const uploadFile = await uploadCloudinary(file)
      if (!uploadFile.success) {
        throw { code: 400, message: 'Upload file error!' }
      } else {
        const data = await recipes.createNewRecipe({
          userId: userIdToken,
          photo: uploadFile.urlUpload,
          title,
          ingredients,
          description
        })

        let videos
        const id = data[0].id
        if (Array.isArray(video)) {
          videos = video.map((item) => {
            return { recipe_id: id, video: item }
          })
        } else {
          videos = { recipe_id: id, video: video }
        }

        await recipeVideos.createVideo({ videos })
      }
    } else {
      throw {
        code: 400,
        message: `Photo must be required!`
      }
    }

    res.status(200).json({
      status: true,
      message: 'Recipe added successful!',
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

const getRecipes = async (req, res) => {
  try {
    const code = 200
    let message
    let recipesData = []

    const { id } = req.params
    const { userId, limit, page, sort, typeSort } = req.query // ?limit=&page=&sort=&typeSort=

    if (id) {
      recipesData = await recipes.getRecipes({ id })
    } else if (userId) {
      recipesData = await recipes.getRecipes({
        userId,
        limit,
        page,
        sort,
        typeSort
      })
    } else {
      recipesData = await recipes.getRecipes({ limit, page, sort, typeSort })
    }

    if (recipesData.length < 1) {
      code = 400
      message = 'Data not found!'
    }

    const total_all_data = recipesData?.[0]?.total_recipes ?? 0

    connect.set('url', req.originalUrl, 'ex', 15)
    connect.set('data', JSON.stringify(recipesData), 'ex', 15)
    if (sort) connect.set('sort', sort, 'ex', 15)
    if (typeSort) connect.set('typeSort', typeSort, 'ex', 15)
    if (page) connect.set('page', page ?? 1, 'ex', 15)
    if (limit) connect.set('limit', limit, 'ex', 15)
    if (total_all_data) connect.set('total_all_data', total_all_data, 'ex', 15)

    res.status(code ?? 200).json({
      status: true,
      message: message ?? 'Data retrieved successfully !',
      sort: sort ?? null,
      typeSort: typeSort ?? null,
      page: parseInt(page) ?? 1,
      limit: parseInt(limit) ?? null,
      total: recipesData.length,
      total_all_data: total_all_data,
      data: recipesData
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const getSearchedRecipes = async (req, res) => {
  try {
    const { searchBy, keyword, page, limit, sort, typeSort } = req.query

    console.log('berjalan search')

    const getData = await recipes.getSearchedRecipes({
      searchBy,
      keyword,
      page,
      limit,
      sort,
      typeSort
    })

    totalData = getData.length
    if (totalData < 1) {
      throw { code: 400, message: 'Data not found!' }
    }

    res.status(200).json({
      status: true,
      message: 'Data retrieved successfully!',
      searchBy,
      keyword,
      limit,
      page,
      total: totalData,
      total_all_data: getData?.[0]?.total_recipes ?? 0,
      data: getData
    })
  } catch (error) {
    console.log(error)
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error
    })
  }
}

const editRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, ingredients } = req.body
    const { authorization } = req.headers

    const decoded = decodeToken(authorization)

    const userIdToken = decoded?.data?.id

    const checkUsers = await users.getUsers({ id: userIdToken })
    if (checkUsers.length < 1) {
      throw { code: 400, message: `User with id ${userIdToken} does not exist` }
    }

    const getRecipes = await recipes.getRecipes({ id })
    if (getRecipes.length < 1) {
      throw { code: 400, message: 'Data does not exist, please try again!' }
    }

    let filename = null

    if (req.files !== null && req.files.photo !== null) {
      let file = req.files.photo
      const checkSize = checkSizeUpload(file)
      if (!checkSize) {
        throw {
          code: 400,
          message: 'File upload is too large, only support < 1 mb !'
        }
      }

      const allowedFile = checkExtensionFile(file)
      if (!allowedFile) {
        throw {
          code: 400,
          message: `File is not support, format file must be photo !`
        }
      }

      const uploadFile = await uploadCloudinary(file)
      if (!uploadFile.success) {
        throw { code: 400, message: 'Upload file error!' }
      } else {
        filename = uploadFile.urlUpload
      }

      const deleteFile = await deleteCloudinary(getRecipes[0]?.photo)
      if (!deleteFile.success) {
        throw { code: 400, message: 'Delete old file error!' }
      }
    }

    const updateData = await recipes.editRecipe({
      id,
      title: title !== '' ? title : getRecipes[0]?.title,
      description:
        description !== '' ? description : getRecipes[0]?.description,
      ingredients:
        ingredients !== '' ? ingredients : getRecipes[0]?.ingredients,
      photo: filename !== null ? filename : getRecipes[0]?.photo
    })

    res.status(200).json({
      status: true,
      message: 'Data updated successful !',
      data: updateData[0]
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await recipes.getRecipes({ id })

    console.log(checkId)

    if (checkId.length === 0) {
      throw { code: 400, message: 'Data doesnt exist' }
    } else {
      const deleteFile = await deleteCloudinary(checkId[0].photo)
      if (!deleteFile.success) {
        throw { code: 400, message: 'Delete old photo error!' }
      }
    }

    await recipes.deleteRecipe({ id })

    res.status(200).json({
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

module.exports = {
  createRecipe,
  getRecipes,
  getSearchedRecipes,
  editRecipe,
  deleteRecipe
}
