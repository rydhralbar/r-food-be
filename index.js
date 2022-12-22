const express = require('express')
// const db = require('./db.js') // import dari file ./db.js
const app = express() // initialization
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3000
const helmet = require('helmet')
const xss = require('xss-clean')
const fileUpload = require('express-fileupload')
const path = require('path')
// const { Validator } = require('node-input-validator')

const userRoute = require('./routes/users.js')
const recipeRoute = require('./routes/recipes.js')
const commentRoute = require('./routes/comments.js')
const videoRoute = require('./routes/videosteps')
const searchRoute = require('./routes/searchrecipe')
const authRoute = require('./routes/auth')


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

// use middleware for grant access upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

// grant access for public
// app.use('/images', express.static(path.join(__dirname, 'public')))

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

// user login
app.use('/auth', authRoute)

app.get('/', (req, res) => {
  res.json({ status: true, message: 'Server running', version: '1.0' })
} )

// running express
app.listen(port, () => {
  console.log(`R-Food App listening on port ${port}`)
})
