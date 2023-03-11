const users = require('../models/users')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const bcrypt = require('bcrypt')
// const { connect } = require('../middlewares/redis')
const { checkSizeUpload, checkExtensionFile } = require('../utils/uploadFile')
const { uploadCloudinary, deleteCloudinary } = require('../utils/cloudinary')

const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    const saltRounds = 10

    const checkEmail = await users.getUserByEmail({ email })

    if (checkEmail.length >= 1) {
      throw { code: 409, message: 'Email already in use' }
    }

    const checkPhone = await users.getUserByPhone({ phone })

    if (checkPhone.length >= 1) {
      throw { code: 409, message: 'Number already in use' }
    }

    const hash = await bcrypt.hash(password, saltRounds)
    if (!hash) {
      throw { code: 400, message: 'Authentication failed!' }
    }

    let file = req.files?.photo

    if (file) {
      const checkSize = checkSizeUpload(file)
      if (!checkSize) {
        throw {
          code: 400,
          message: 'File upload is too large, only support < 1 MB !'
        }
      }

      const allowedFile = checkExtensionFile(file)
      if (!allowedFile) {
        throw {
          code: 400,
          message: `File is not support, format file must be image !`
        }
      }

      const uploadFile = await uploadCloudinary(file)
      if (!uploadFile.success) {
        throw { code: 400, message: 'Upload file error!' }
      } else {
        await users.createNewUser({
          name,
          email,
          phone,
          password: hash,
          photo: uploadFile.urlUpload
        })
      }
    } else {
      await users.createNewUser({ name, email, phone, password: hash })
    }

    res.status(201).json({
      status: true,
      message: 'Register successful !'
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const getUsers = async (req, res) => {
  try {
    let code = 200
    let message
    let dataUser = []
    let url

    const { id } = req.params
    const { sort, typeSort, page, limit } = req.query

    if (id) {
      dataUser = await users.getUsers({ id })
    } else {
      dataUser = await users.getUsers({ sort, typeSort, page, limit })
    }

    if (dataUser.length < 1) {
      code = 400
      message = `Data with id ${id} does not exist`
    }

    // connect.set('url', req.originalUrl, 'ex', 15)
    // connect.set('data', JSON.stringify(dataUser), 'ex', 15)
    // if (sort) connect.set('sort', sort, 'ex', 15)
    // if (typeSort) connect.set('typeSort', typeSort, 'ex', 15)
    // if (page) connect.set('page', page ?? 1, 'ex', 15)
    // if (limit) connect.set('limit', limit, 'ex', 15)

    res.status(code ?? 200).json({
      status: true,
      message: message ?? 'Data retrieved successfully',
      sort: sort ?? null,
      typeSort: typeSort ?? null,
      page: parseInt(page) ?? 1,
      limit: parseInt(limit) ?? null,
      total: dataUser.length,
      data: dataUser
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const editUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, password } = req.body

    const saltRounds = 10

    const getUser = await users.getUserById({ id })

    if (getUser.length === 0) {
      throw { code: 401, message: 'ID not registered' }
    }

    if (email) {
      const checkEmail = await users.getEmailUser({ email })

      if (checkEmail.length >= 1) {
        throw { code: 401, message: 'Email already in use' }
      }
    }

    if (phone) {
      const checkPhone = await users.getUserByPhone({ phone })
      if (checkPhone.length >= 1) {
        throw { code: 401, message: 'Number already in use' }
      }
    }

    let hash

    if (password) {
      hash = await bcrypt.hash(password, saltRounds)
      if (!hash) {
        throw { code: 400, message: 'Authentication failed!' }
      }
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

      const deleteFile = await deleteCloudinary(getUser[0]?.photo)
      if (!deleteFile.success) {
        throw { code: 400, message: 'Delete old file error!' }
      }
    }
    console.log('dibawah cloudinary')

    const updateData = await users.editUser({
      id,
      name: name !== '' ? name : getUser[0]?.name,
      email: email !== '' ? email : getUser[0]?.email,
      phone: phone !== '' ? phone : getUser[0]?.phone,
      password: password !== '' ? hash : getUser[0]?.password,
      photo: filename !== null ? filename : getUser[0]?.photo
    })

    res.status(200).json({
      status: true,
      message: 'Data updated successfully !',
      data: updateData
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await users.getUserById({ id })

    if (checkId.length === 0) {
      throw { code: 400, message: 'Data doesnt exist' }
    } else {
      const deleteImage = await deleteCloudinary(checkId[0].photo)
      if (!deleteImage) {
        throw { code: 400, message: 'Failed to delete old photo' }
      }
    }

    await users.deleteUser({ id })

    res.status(200).json({
      status: true,
      message: 'Data deleted successfully'
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error
    })
  }
}

module.exports = { createUser, getUsers, editUser, deleteUser }
