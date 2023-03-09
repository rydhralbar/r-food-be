const db = require('../db')

const updatedAt = new Date()
const createdAt = new Date()

const createNewUser = async (params) => {
  const { name, email, phone, password, photo } = params

  if (photo) {
    return await db`INSERT INTO users (name, email, phone, password, photo, created_at, updated_at) VALUES(${name}, ${email}, ${phone}, ${password}, ${photo}, ${createdAt}, ${updatedAt})`
  } else {
    return await db`INSERT INTO users (name, email, phone, password, created_at, updated_at) VALUES(${name}, ${email}, ${phone}, ${password}, ${createdAt}, ${updatedAt})`
  }
}

const getUserById = async (params) => {
  const { id } = params

  return await db`
     SELECT * FROM users WHERE id = ${id}
   `
}

const getUserByEmail = async (params) => {
  const { email } = params

  return await db`
      SELECT * FROM users WHERE email = ${email}
    `
}

const getUserByPhone = async (params) => {
  const { phone } = params

  return await db`
      SELECT phone FROM users WHERE phone = ${phone}
    `
}

const getEmailUser = async (params) => {
  const { email } = params

  return await db`SELECT email FROM users WHERE email = ${email}`
}

// get user from db
const getUsers = async (params) => {
  const { id, email, limit, page, sort, typeSort } = params

  if (id) {
    return await db`SELECT * FROM users WHERE id = ${id}`
  }

  // get data by email
  if (email) {
    return await db`SELECT * FROM users WHERE email = ${email}`
  }

  // get all data with sort
  if (sort) {
    return typeSort && typeSort === 'desc'
      ? await db`SELECT * FROM users ORDER BY ${db(sort)} DESC LIMIT ${
          limit ?? null
        } OFFSET ${page ? limit * (page - 1) : 0}`
      : await db`SELECT * FROM users ORDER BY ${db(sort)} ASC LIMIT ${
          limit ?? null
        } OFFSET ${page ? limit * (page - 1) : 0}`
  } else {
    return await db`SELECT * FROM users LIMIT ${limit ?? null} OFFSET ${
      page ? limit * (page - 1) : 0
    }`
  }
}

const editUser = async (params) => {
  const { id, name, email, phone, password, photo } = params
  return await db`UPDATE users SET "name"= ${name}, "email"= ${email}, "phone"= ${phone}, "password"= ${password}, "photo"= ${photo}, "updated_at"= ${updatedAt} WHERE id=${id} RETURNING *`
}

const editUserPhoto = async (params) => {
  const { id, name, email, phone, password, photo, getUser } = params

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

  return await db`DELETE FROM users WHERE id=${id}`
}

module.exports = {
  getUserByEmail,
  getUserByPhone,
  getUsers,
  editUser,
  editUserPhoto,
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
