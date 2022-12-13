const express = require('express')
// const db = require('./db.js') // import dari file ./db.js
const app = express() // initialization
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3000
const helmet = require('helmet')
const xss = require('xss-clean')
// const { Validator } = require('node-input-validator')

const userRoute = require('./routes/users.js')
const recipeRoute = require('./routes/recipes.js')
const commentRoute = require('./routes/comments.js')
const videoRoute = require('./routes/videosteps')
const searchRoute = require('./routes/searchrecipe')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// use cors
app.use(cors()) // FOR ALL

// use helmet
app.use(helmet())

// use xss
app.use(xss())

// users route
app.use('/users', userRoute)

// recipes route
app.use('/recipes', recipeRoute)

// comment route
app.use('/recipes-comment', commentRoute)

// video step route
app.use('/recipes-video', videoRoute)

// // get searched recipe
app.use('/recipe-search', searchRoute)

// running express
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
