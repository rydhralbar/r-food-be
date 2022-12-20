const accounts = require('../models/accounts.js')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
// const helper = require('../helper')
// const sharp = require('sharp')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { connect } = require('../middlewares/redis')
const { cloudinary } = require('../helper')

const createUser = async (req, res) => {
  try {
    const { name, email, phone, password} = req.body

    const checkEmail = await accounts.getUserByEmail({ email })

    if (checkEmail.length >= 1) {
      throw { code : 401, message: 'Email already in use' }
    }

    const checkPhone = await accounts.getUserByPhone({ phone })

    if (checkPhone.length >= 1) {
      throw { code: 401, message: 'Number already in use' }
    }
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const file = req.files.photo
    // console.log(file)

    if(file){
      // const fileName = `${uuidv4()}-${file.name}`
      // const uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`
      const mimeType = file.mimetype.split('/')[1]
      const allowFile = ['jpeg', 'jpg', 'png', 'webp']
  
      if (file.size > 1048576) {
        throw new Error('File size too big, max 1mb')
      }
      
      if (allowFile.find((item) => item === mimeType)) {
        // Use the mv() method to place the file somewhere on your server
        // file.mv(uploadPath, async function (err) {
          // await sharp(file).jpeg({ quality: 20 }).toFile(uploadPath)
        cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { public_id: uuidv4() },
          function (error, result){
            if (error) {
              throw 'Upload foto gagal'
            }
            
            bcrypt.hash(password, saltRounds, async (err, hash) => {
              if (err) {
                throw 'Proses authentikasi gagal, silahkan coba lagi'
              }
              
                const addToDb = await accounts.createNewUserPhoto({
                  name,
                  email,
                  phone,
                  password: hash,
                  // photo: `/images/${fileName}`
                  photo: result.url,  
                })
                res.json({
                  status: true,
                  message: 'Inserted successfully',
                  data: addToDb
                })
              })
            })
          
            // })
         } else {
            throw new Error('Failed upload, only photo format input')
          }
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          throw 'Proses authentikasi gagal, silahkan coba lagi'
        }
  
      const addToDb2 = await accounts.createNewUser({
        name,
        email,
        phone,
        password: hash,
      })
  
      res.json({
        status: true,
        message: 'InserteD successfully',
        data: addToDb2
      })
    })
    }
    

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
    const { id } = req.params
    const { sort, page, limit } = req.query

    let getAllUser
    // TO SORT BY NAME, WITH PAGINATION OR WITHOUT PAGINATION
    if (sort === 'name_asc') {
      getAllUser = await accounts.getUserSortAsc()
    } else if (sort === 'name_desc') {
      getAllUser = await accounts.getUserSortDesc()
    } else if (page) {
      getAllUser = await accounts.getUserPagin({ page, limit })
    } else if (limit) {
      getAllUser = await accounts.getUserLimit({ limit })
    } else if (sort === 'id') {
      getAllUser = await accounts.getUserSortId()
    } else {
      getAllUser = await accounts.getAllUser()
    }

    connect.set('url', req.originalUrl, 'ex', 10)
    connect.set('data', JSON.stringify(getAllUser), 'ex', 10)
    connect.set('total', getAllUser?.length, 'ex', 10)
    connect.set('limit', limit, 'ex', 10)
    connect.set('page', page, 'ex', 10)
    connect.set('is_paginate', 'true', 'ex', 10)

    // const totalUser = await accounts.getAllUser()

    if (id) {
      const getSelectedUser = await accounts.getUserById({ id })

      connect.set('url', req.originalUrl, 'ex', 10)
      connect.set('data', JSON.stringify(getSelectedUser), 'ex', 10)
      connect.set('is_paginate', null, 'ex', 10)

      if (getSelectedUser.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getSelectedUser
        })
      } else {
        throw new Error('Data is empty, please try again')
      }
    } else {


      if (getAllUser.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          total: getAllUser.length,
          page: Number(page),
          limit: Number(limit),
          data: getAllUser
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

const editUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, password, photo } = req.body

    if (email) {
      const checkEmail = await accounts.getEmailUser({ email })

      if (checkEmail.length >= 1) {
        throw { code: 401, message: 'Email already in use' }
      }
    }

    if (phone) {
      const checkPhone = await accounts.getUserByPhone({ phone })
      if (checkPhone.length >= 1) {
        throw { code: 401, message: 'Number already in use' }
      }
    }
    
    const getUser = await accounts.getUserById({ id })

    if (getUser.length === 1) {
      // EDIT DATA AT account_user (name, email, phone, password, photo) VALUES ("")
      await accounts.editUser({ id, name, email, phone, password, photo, getUser })
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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await accounts.getUserById({ id })

    if (checkId.length === 0) {
      throw new Error({ code: 405, message: 'Data is empty' })
    }

    await accounts.deleteUser({ id })

    res.json({
      status: true,
      message: 'Deleted successfully'
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = { createUser, getUsers, editUser, deleteUser }
