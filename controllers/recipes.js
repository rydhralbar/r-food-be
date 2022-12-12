const recipes = require('../models/recipes.js')
const db = require('../db') // import dari file ./db.js


// create recipe
const createRecipe = async (req, res) => {
  try {
    const { photo, title, ingredients } = req.body

    // INSERT INTO food_recipe (photo, title, ingredients, video) VALUES ("")
    const addToDb = await recipes.createNewRecipe({photo, title, ingredients})

    res.json({
      status: true,
      message: 'Inserted successfully',
      data: addToDb
    })
  } catch (error) {
    res.status(500).json({
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
    const { sort } = req.query

    let getAllRecipe

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
   }else {
      getAllRecipe = await recipes.getAllRecipes()
    }

    if (id) {
      const getSelectedRecipe = await recipes.getRecipeById({id})

      if(getSelectedRecipe.length > 0){
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getSelectedRecipe
        })
      } else {
        throw 'Data is empty, please try again'
      }
    } else {
      if (getAllRecipe.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          total: getAllRecipe.length,
          data: getAllRecipe
        })
      } else {
        throw 'Data is empty, please try again'
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

    const getRecipes = await recipes.getRecipeById({id})

    if (getRecipes) {
      // EDIT DATA AT food_recipe (photo, title, ingredients) VALUES ("")
      await recipes.editRecipe({id, photo, title, ingredients, getRecipes})
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

// delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await recipes.getRecipeById({ id })

      if (checkId.length === 0) {
         throw { code: 401, message: 'Data is empty' }
      }

    await recipes.deleteRecipe({id})

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

// get search recipe
const getRecipeSearch = async (req, res) => {
  try {
    const { title } = req.params
    const { sort } = req.query // STILL TROUBLE

    // console.log(`SELECT * FROM food_recipe WHERE title LIKE '%${title}%'`)

    let getSearchedRecipe
    if (sort === 'asc') {
      getSearchedRecipe = await recipes.getRecipeSearchAsc({title})
    } else if (sort === 'desc') {
      getSearchedRecipe = await recipes.getRecipeSearchDesc({title})
    } else {
      getSearchedRecipe = await recipes.getRecipeSearch({title})
    }

    if (getSearchedRecipe.length > 0) {
      res.status(200).json({
        status: true,
        message: 'Retrieved successfully',
        total: getSearchedRecipe.length,
        data: getSearchedRecipe
      })
    } else {
      throw 'DATA IS EMPTY, PLEASE TRY AGAIN'
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}


module.exports = {createRecipe, getRecipes, editRecipe, deleteRecipe, getRecipeSearch}