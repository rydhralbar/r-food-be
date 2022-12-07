const express = require('express')
const db = require('./db.js') // import dari file ./db.js
const app = express() // inisialisasi
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// use cors
app.use(cors()) // FOR ALL

// whitelist ip
// const allowList = ['http://shopee.co.id']
// const corsOptionsAllow= (req, callback) => {
//   let corsOptions
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

// CRUD USERS

// CREATE USERS

app.post('/users', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // INSERT INTO account_user (name, email, phone, password) VALUES ("")
    const addToDb = await db`
      INSERT INTO account_user (name, email, phone, password) 
      VALUES (${name}, ${email}, ${phone}, ${password})
    `
    res.json({
      Status: true,
      Message: 'INSERTED SUCCESSFULLY',
      Data: addToDb
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// READ USERS
// /users/:id? << optional id
// /users/1 << how to use

app.get('/users/:id?', async (req, res) => {
  try {
    const { id } = req.params
    const { sort, page, limit } = req.query

    let getAllUser

    // TO SORT BY NAME
    if (sort === 'name_asc') {
      getAllUser = await db`SELECT * FROM account_user ORDER BY name ASC`
    } else if (sort === 'name_desc') {
      getAllUser = await db`SELECT * FROM account_user ORDER BY name DESC`
    } else if (page) {
      getAllUser = await db`SELECT * FROM account_user LIMIT ${limit} OFFSET ${limit * (page - 1)}`
    } else if (limit) {
      getAllUser = await db`SELECT * FROM account_user LIMIT ${limit}`
    } else {
      getAllUser = await db`SELECT * FROM account_user`
    }

    if (id) {
      const getSelectedUser =
                await db`SELECT * FROM account_user WHERE id = ${id}`
      if (getSelectedUser.length > 0) {
        res.status(200).json({
          Status: true,
          Message: 'RETRIEVED SUCCESSFULLY',
          Data: getSelectedUser
        })
      } else {
        throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
      }
    } else {
      if (getAllUser.length > 0) {
        res.status(200).json({
          Status: true,
          Message: 'RETRIEVED SUCCESSFULLY',
          Total_User: getAllUser.length,
          Data: getAllUser
        })
      } else {
        throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
      }
    }
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// UPDATE USERS
// "/users/:id" << users id
// /users/1 << how to use

app.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, password, photo } = req.body

    const getUser = await db`SELECT * FROM account_user WHERE id = ${id}`

    if (getUser) {
      // EDIT DATA AT account_user (name, email, phone, password, photo) VALUES ("")
      await db`
        UPDATE account_user SET
          "name" = ${name || getUser[0]?.name},
          "email" = ${email || getUser[0]?.email},
          "phone" = ${phone || getUser[0]?.phone},
          "password" = ${password || getUser[0]?.password},
          "photo" = ${photo || getUser[0]?.photo}
        WHERE "id" = ${id};
      `
    } else {
      throw 'ID not registered'
    }

    res.json({
      Status: true,
      Message: 'EDITED SUCCESSFULLY'
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

//  DELETE USERS
// "/users/:id" <<- users id
// /users/1 << how to use

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params

    await db`DELETE FROM "public"."account_user" WHERE "id" = ${id}`

    res.json({
      Status: true,
      Message: 'DELETED SUCCESSFULLY'
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// CRUD RECIPES

// CREATE RECIPES

app.post('/recipe', async (req, res) => {
  try {
    const { photo, title, ingredients, video } = req.body

    // INSERT INTO food_recipe (photo, title, ingredients, video) VALUES ("")
    const addToDb = await db`
      INSERT INTO food_recipe (photo, title, ingredients, video) 
      VALUES (${photo}, ${title}, ${ingredients}, ${video})
    `

    res.json({
      Status: true,
      Message: 'INSERTED SUCCESSFULLY',
      Data: addToDb
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// READ RECIPES
// /recipe/:id? << optional id
// /recipe/1 << how to use

app.get('/recipe/:id?', async (req, res) => {
  try {
    const { id } = req.params
    const { sort } = req.query

    let getAllRecipe

    // TO SORT BY NAME AND SORT BY DATE
    if (sort === 'title_asc') {
      getAllRecipe =
                await db`SELECT * FROM food_recipe ORDER BY title ASC`
    } else if (sort === 'created_at_asc') {
      getAllRecipe =
                await db`SELECT * FROM food_recipe ORDER BY created_at ASC`
    } else if (sort === 'title_desc') {
      getAllRecipe =
                await db`SELECT * FROM food_recipe ORDER BY title   DESC`
    } else if (sort === 'created_at_desc') {
      getAllRecipe =
                await db`SELECT * FROM food_recipe ORDER BY created_at DESC`
    } else {
      getAllRecipe = await db`SELECT * FROM food_recipe`
    }

    if (id) {
      const getSelectedRecipe =
                await db`SELECT * FROM food_recipe WHERE id = ${id}`

      res.status(200).json({
        Status: true,
        Message: 'RETRIEVED SUCCESSFULLY',
        Data: getSelectedRecipe
      })
    } else {
      if (getAllRecipe.length > 0) {
        res.status(200).json({
          Status: true,
          Message: 'RETRIEVED SUCCESSFULLY',
          Total_Recipe: getAllRecipe.length,
          Data: getAllRecipe
        })
      } else {
        throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
      }
    }
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// UPDATE RECIPES
// /recipe/:id << recipe id
// /recipe/1 << how to use

app.patch('/recipe/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { photo, title, ingredients } = req.body

    const getRecipes = await db`SELECT * FROM food_recipe WHERE id = ${id}`

    if (getRecipes) {
      // EDIT DATA AT food_recipe (photo, title, ingredients) VALUES ("")
      await db`
        UPDATE food_recipe SET
          "photo" = ${photo || getRecipes[0]?.photo},
          "title" = ${title || getRecipes[0]?.title},
          "ingredients" = ${ingredients || getRecipes[0]?.ingredients}
          WHERE "id" = ${id};
      `
    } else {
      throw 'ID not registered'
    }

    res.json({
      Status: true,
      Message: 'EDITED SUCCESSFULLY'
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// DELETE RECIPES
// /recipe/:id << recipe id
// /recipe/1 << how to use

app.delete('/recipe/:id', async (req, res) => {
  try {
    const { id } = req.params

    await db`DELETE FROM "public"."food_recipe" WHERE "id" = ${id}`

    res.json({
      Status: true,
      Message: 'DELETED SUCCESSFULLY'
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// CRUD COMMENTS

// CREATE COMMENTS

app.post('/recipe-comment', async (req, res) => {
  try {
    const { comment } = req.body

    // INSERT INTO comment (comment) VALUES ("")
    const addToDb = await db`
      INSERT INTO comment_recipe (comment) 
      VALUES (${comment})
    `

    res.json({
      Status: true,
      Message: 'INSERTED SUCCESSFULLY',
      Data: addToDb
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// READ COMMENTS
// /recipe/comment/:id? << optional id
// /recipe/comment/1 << how to use

app.get('/recipe-comment/:id?', async (req, res) => {
  try {
    const { id } = req.params

    if (id) {
      const getSelectedComment =
                await db`SELECT * FROM comment_recipe WHERE id = ${id}`

      if (getSelectedComment.length > 0) {
        res.status(200).json({
          Status: true,
          Message: 'RETRIEVED SUCCESSFULLY',
          Data: getSelectedComment
        })
      } else {
        throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
      }
    } else {
      const getAllComments = await db`SELECT * FROM comment_recipe`

      if (getAllComments.length > 0) {
        res.status(200).json({
          Status: true,
          Message: 'RETRIEVED SUCCESSFULLY',
          Data: getAllComments
        })
      } else {
        throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
      }
    }
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// UPDATE COMMENTS
// /recipe/comment/:id << recipe id
// /recipe/comment/1 << how to use

app.patch('/recipe-comment/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { comment } = req.body

    const getComments =
            await db`SELECT * FROM comment_recipe WHERE id = ${id}`

    if (getComments && getComments.length > 0) {
      // INSERT INTO comment_recipe (comment) VALUES ("")
      await db`
        UPDATE comment_recipe SET
          "comment" = ${comment || getComments[0]?.comment}
          WHERE "id" = ${id};
      `
    } else {
      throw 'ID not registered'
    }

    res.json({
      Status: true,
      Message: 'EDITED SUCCESSFULLY'
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// DELETE COMMENTS
// /recipe-comment/:id << recipe id
// /recipe-comment/1 << how to use

app.delete('/recipe-comment/:id', async (req, res) => {
  try {
    const { id } = req.params

    await db`DELETE FROM "public"."comment_recipe" WHERE "id" = ${id}`

    res.json({
      Status: true,
      Message: 'DELETED SUCCESSFULLY'
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// CRUD VIDEO RECIPE

// CREATE VIDEO RECIPE

app.post('/video-recipe', async (req, res) => {
  try {
    const { video_step1, video_step2, video_step3, video_step4 } = req.body

    // INSERT INTO video_step_recipe (video_step1, video_step2, video_step3, video_step4) VALUES ("")
    const addToDb = await db`
      INSERT INTO video_step_recipe (video_step1, video_step2, video_step3, video_step4) 
      VALUES (${video_step1}, ${video_step2}, ${video_step3}, ${video_step4})
    `

    res.json({
      Status: true,
      Message: 'INSERTED SUCCESSFULLY',
      Data: addToDb
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// READ VIDEO RECIPE
// /video-recipe/:id? << optional id
// /video-recipe//1 << how to use

app.get('/video-recipe/:id?', async (req, res) => {
  try {
    const { id } = req.params

    if (id) {
      const getSelectedVideo =
                await db`SELECT * FROM video_step_recipe WHERE id = ${id}`

      if (getSelectedVideo.length > 0) {
        res.status(200).json({
          Status: true,
          Message: 'RETRIEVED SUCCESSFULLY',
          Data: getSelectedVideo
        })
      } else {
        throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
      }
    } else {
      const getAllVideos = await db`SELECT * FROM video_step_recipe`

      if (getAllVideos.length > 0) {
        res.status(200).json({
          Status: true,
          Message: 'RETRIEVED SUCCESSFULLY',
          Data: getAllVideos
        })
      } else {
        throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
      }
    }
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// UPDATE VIDEO RECIPE
// /video-recipe/:id << recipe id
// /video-recipe/1 << how to use

app.patch('/video-recipe/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { video_step1, video_step2, video_step3 } = req.body

    const getVideos = await db`SELECT * FROM video_step_recipe WHERE id = ${id}`

    if (getVideos) {
      // EDIT DATA AT video_step_recipe (video_step1, video_step2, video_step3) VALUES ("")
      await db`
        UPDATE video_step_recipe SET
          "video_step1" = ${video_step1 || getVideos[0]?.video_step1},
          "video_step2" = ${video_step2 || getVideos[0]?.video_step2},
          "video_step3" = ${video_step3 || getVideos[0]?.video_step3}
          WHERE "id" = ${id};
      `
    } else {
      throw 'ID not registered'
    }

    res.json({
      Status: true,
      Message: 'EDITED SUCCESSFULLY'
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// DELETE VIDEO RECIPE
// /video-recipe/:id << recipe id
// /video-recipe/1 << how to use

app.delete('/video-recipe/:id', async (req, res) => {
  try {
    const { id } = req.params

    await db`DELETE FROM "public"."video_step_recipe" WHERE "id" = ${id}`

    res.json({
      Status: true,
      Message: 'DELETED SUCCESSFULLY'
    })
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})
// READ SEARCHED RECIPES

app.get('/recipe-search/:title', async (req, res) => {
  try {
    const { title } = req.params
    const { sort } = req.query // STILL TROUBLE

    // console.log(`SELECT * FROM food_recipe WHERE title LIKE '%${title}%'`)

    let getSearchedRecipe
    if (sort === 'asc') {
      getSearchedRecipe =
                await db`SELECT * FROM food_recipe WHERE LOWER (title) LIKE LOWER (${
                    '%' + title + '%'
                }) ORDER BY title ASC`
    } else {
      getSearchedRecipe =
                await db`SELECT * FROM food_recipe WHERE LOWER (title) LIKE LOWER (${
                    '%' + title + '%'
                })`
    }

    if (getSearchedRecipe.length > 0) {
      res.status(200).json({
        Status: true,
        Message: 'RETRIEVED SUCCESSFULLY',
        Total_Recipe: getSearchedRecipe.length,
        Data: getSearchedRecipe
      })
    } else {
      throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
    }
  } catch (error) {
    res.status(500).json({
      Status: false,
      Message: error?.message ?? error,
      Data: []
    })
  }
})

// running express
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
