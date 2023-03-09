const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3001
const helmet = require('helmet')
const xss = require('xss-clean')
const fileUpload = require('express-fileupload')
const path = require('path')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const recipeRoutes = require('./routes/recipes')
const videoRoutes = require('./routes/recipeVideos')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors())

app.use(helmet())

app.use(xss())

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

app.use('/auth', authRoutes)

app.use('/users', userRoutes)

app.use('/recipes', recipeRoutes)

app.use('/recipe-videos', videoRoutes)

app.get('/', (req, res) => {
  res.json({ status: true, message: 'Server running', version: '1.0' })
})

// running express
app.listen(port, () => {
  console.log(`R-Food App listening on port ${port}`)
})
