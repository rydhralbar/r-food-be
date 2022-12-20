const db = require('../db') // import from file ./db.js

const getUserById = async (params) => {
  const { id } = params

  return await db`
     SELECT * FROM account_user WHERE id = ${id}
   `
}

const getUserByEmail = async (params) => {
  const { email } = params

  return await db`
      SELECT * FROM account_user WHERE email = ${email}
    `
}

const getUserByPhone = async (params) => {
  const { phone } = params

  return await db`
      SELECT phone FROM account_user WHERE phone = ${phone}
    `
}

const getEmailUser = async (params) => {
  const { email } = params

  return await db`SELECT email FROM account_user WHERE email = ${email}`
}

// add new user to db
const createNewUserPhoto = async (params) => {
  const { name, email, phone, password, photo } = params

  return await db`
      INSERT INTO account_user (name, email, phone, password, photo) 
      VALUES (${name}, ${email}, ${phone}, ${password}, ${photo})
    `
}

// get user from db
const getAllUser = async () => {
  return await db`
      SELECT * FROM account_user`
}

// edit user data
const editUser = async (params) => {
  const { id, name, email, phone, password, getUser } = params

  return await db`
  UPDATE account_user SET
  "name" = ${name || getUser[0]?.name},
  "email" = ${email || getUser[0]?.email},
  "phone" = ${phone || getUser[0]?.phone},
  "password" = ${password || getUser[0]?.password},
  "photo" = ${photo || getUser[0]?.photo}
WHERE "id" = ${id};`
}

const getUserSortAsc = async () => {
  return await db`SELECT * FROM account_user ORDER BY name ASC`
}

const getUserSortDesc = async () => {
  return await db`SELECT * FROM account_user ORDER BY name DESC`
}

const getUserSortId = async () => {
  return await db`SELECT * FROM account_user ORDER BY id ASC`
}

const getUserPagin = async (params) => {
  const { page, limit } = params

  return await db`SELECT * FROM account_user LIMIT ${limit} OFFSET ${
      limit * (page - 1)
   }`
}

const getUserLimit = async (params) => {
  const { limit } = params

  return await db`SELECT * FROM account_user LIMIT ${limit}`
}

const deleteUser = async (params) => {
  const { id } = params

  return await db`DELETE FROM "public"."account_user" WHERE "id" = ${id}`
}

const createNewUser = async (params) => {
  const { name, email, phone, password } = params

  return await db`
      INSERT INTO account_user (name, email, phone, password) 
      VALUES (${name}, ${email}, ${phone}, ${password})
    `
}

module.exports = {
  getUserByEmail,
  getUserByPhone,
  createNewUserPhoto,
  getAllUser,
  editUser,
  getUserById,
  getUserSortAsc,
  deleteUser,
  getUserSortDesc,
  getUserPagin,
  getUserLimit,
  getUserSortId,
  createNewUser,
  getEmailUser
}
