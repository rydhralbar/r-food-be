const recipes = require('../models/recipes.js');
// const db = require('../db') // import dari file ./db.js
const { cloudinary } = require('../helper');
const { v4: uuidv4 } = require('uuid')

// create recipe
const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, slug} = req.body
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
              throw 'Photo upload failed'
            }

                const addToDb = recipes.createNewRecipePhoto({
                  title,
                  photo: result.url,
                  ingredients,
                  slug,  
                })
                res.json({
                  status: true,
                  message: 'Inserted successfully',
                  data: addToDb
                })
              })
          
            // })
         } else {
            throw new Error('Upload failed, only photo format input')
          }
    } else {
      const addToDb2 = await accounts.createNewRecipe({
        title,
        ingredients,
        slug,
      })
  
      res.json({
        status: true,
        message: 'Inserted successfully',
        data: addToDb2
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

// get recipes
const getRecipes = async (req, res) => {
  try {
    const { id } = req.params
    const { sort, page, limit } = req.query

    let getAllRecipe;
    let getCountRecipe;

    getCountRecipe = await recipes.getCountRecipe()

    // TO SORT BY NAME AND SORT BY DATE
    if (sort === 'title_asc') {
      getAllRecipe = await recipes.getRecipeSortNameAsc()
    } else if (sort === 'created_at_asc') {
      getAllRecipe = await recipes.getRecipeSortCreatedAsc()
    } else if (sort === 'title_desc') {
      getAllRecipe = await recipes.getRecipeSortNameDesc()
    } else if (sort === 'created_at_desc') {
      getAllRecipe = await recipes.getRecipeSortCreatedDesc()
    } else if (sort === 'id') {
      getAllRecipe = await recipes.getRecipeSortId()
    } else if ( page && limit) {
      getAllRecipe = await recipes.getRecipePagin({ page, limit })
    } else {
      getAllRecipe = await recipes.getAllRecipes()
    }

    // connect.set('url', req.originalUrl, 'ex', 10)
    // connect.set('data', JSON.stringify(getAllRecipe), 'ex', 10)
    // connect.set('total', getAllRecipe?.length, 'ex', 10)
    // connect.set('limit', limit, 'ex', 10)
    // connect.set('page', page, 'ex', 10)
    // connect.set('is_paginate', 'true', 'ex', 10)
    // connect.set('all_pagination', getCountRecipe, 'ex', 10)

    if (id) {
      const getSelectedRecipe = await recipes.getRecipeById({ id })

      if (getSelectedRecipe.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getSelectedRecipe,
        })
      } else {
        throw new Error('Data is empty, please try again')
      }
    } else {
      if (getAllRecipe.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          total: getAllRecipe.length,
          page: Number(page),
          limit: Number(limit),
          data: getAllRecipe,
          all_pagination: getCountRecipe,
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

// edit recipe
const editRecipe = async (req, res) => {
  try {
    const { id } = req.params
    const { photo, title, ingredients } = req.body
    let getRecipes
    const checkId = await recipes.checkId({ id })

    if (checkId.length >= 1) {
      getRecipes = await recipes.getRecipeById({ id })
    }

    if (getRecipes) {
      // EDIT DATA AT food_recipe (photo, title, ingredients) VALUES ("")
      await recipes.editRecipe({ id, photo, title, ingredients, getRecipes })
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

// delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await recipes.getRecipeById({ id })

    if (checkId.length === 0) {
      throw new Error('Data is empty')
    }

    await recipes.deleteRecipe({ id })

    res.json({
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

// get search recipe
const getRecipeSearch = async (req, res) => {
  try {
    const { title } = req.params
    const { sort } = req.query // STILL TROUBLE

    // console.log(`SELECT * FROM food_recipe WHERE title LIKE '%${title}%'`)

    let getSearchedRecipe
    if (sort === 'asc') {
      getSearchedRecipe = await recipes.getRecipeSearchAsc({ title })
    } else if (sort === 'desc') {
      getSearchedRecipe = await recipes.getRecipeSearchDesc({ title })
    } else {
      getSearchedRecipe = await recipes.getRecipeSearch({ title })
    }

    if (getSearchedRecipe.length > 0) {
      res.status(200).json({
        status: true,
        message: 'Retrieved successfully',
        total: getSearchedRecipe.length,
        data: getSearchedRecipe
      })
    } else {
      throw new Error({ code: 405, message: 'Data is empty, please' })
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = { createRecipe, getRecipes, editRecipe, deleteRecipe, getRecipeSearch }
