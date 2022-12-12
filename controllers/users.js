const accounts = require('../models/accounts.js')
const db = require('../db') // import from file ./db.js

const createUser = async (req, res) => {
   try {
      const { name, email, phone, password } = req.body

      const checkEmail = await accounts.getUserByEmail({ email })

      if (checkEmail.length >= 1) {
         throw { code: 401, message: 'Email already in use' }
      }

      const checkPhone = await accounts.getUserByPhone({ phone })

      if (checkPhone.length >= 1) {
         throw { code: 401, message: 'Number already in use' }
      }

      const addToDb = await accounts.createNewUser({
         name,
         email,
         phone,
         password,
      })
      res.json({
         status: true,
         message: 'Inserted successfully',
         data: addToDb,
      })
   } catch (error) {
      res.status(error?.code ?? 500).json({
         status: false,
         message: error?.message ?? error,
         data: [],
      })
   }
}

const getUsers = async (req, res) => {
   try {
      const { id } = req.params
      const {sort, page, limit} = req.query

      let getAllUser 
         // TO SORT BY NAME, WITH PAGINATION OR WITHOUT PAGINATION
         if (sort === 'name_asc') {
            getAllUser = await accounts.getUserSortAsc()
         } else if (sort === 'name_desc') {
            getAllUser = await accounts.getUserSortDesc()
         } else if (page) {
            getAllUser = await accounts.getUserPagin({page, limit})
         } else if (limit) {
            getAllUser = await accounts.getUserLimit({limit})
         } else if (sort === 'id') {
            getAllUser = await accounts.getUserSortId()
         } else {
            getAllUser = await accounts.getAllUser()
         }

      // const totalUser = await accounts.getAllUser()
      
      if (id) {
         const getSelectedUser = await accounts.getUserById({id})
         if (getSelectedUser.length > 0) {
            res.status(200).json({
               status: true,
               message: 'Retrieved successfully',
               data: getSelectedUser,
            })
         } else {
            throw 'Data is empty, please try again'
         }
      } else {
         if (getAllUser.length > 0) {
            res.status(200).json({
               status: true,
               message: 'Retrieved successfully',
               total: getAllUser.length,
               // page: Number(page),
               // limit: Number(limit),
               data: getAllUser,
            })
         } else {
            throw 'Data is empty, please try again'
         }
      }
   } catch (error) {
      res.status(500).json({
         status: false,
         message: error?.message ?? error,
         data: [],
      })
   }
}

const editUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, password, photo } = req.body

    if(email){
       const checkEmail = await accounts.getUserByEmail({ email })
   
         if (checkEmail.length >= 1) {
            throw { code: 401, message: 'Email already in use' }
         }
    }

    if(phone){
       const checkPhone = await accounts.getUserByPhone({ phone })
          if (checkPhone.length >= 1) {
             throw { code: 401, message: 'Number already in use' }
          }

    }


    const getUser = await accounts.getUserById({id})

    if (getUser) {
      // EDIT DATA AT account_user (name, email, phone, password, photo) VALUES ("")
      await accounts.editUser({id, name, email, phone, password, photo, getUser})
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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await accounts.getUserById({ id })

      if (checkId.length === 0) {
         throw { code: 401, message: 'Data is empty' }
      }

    await accounts.deleteUser({id})

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

module.exports = { createUser, getUsers, editUser, deleteUser}