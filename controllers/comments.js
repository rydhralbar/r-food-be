const comments = require('../models/comments')

const createComment = async (req, res) => {
  try {
    const { comment, userId, recipeId } = req.body

    const checkUserId = await comments.checkUserComment({ userId })

    if (checkUserId.length === 0) {
      throw new Error({ code: 401, message: 'User ID not registered' })
    }

    const checkRecipeId = await comments.checkRecipeComment({ recipeId })

    if (checkRecipeId.length === 0) {
      throw new Error({ code: 401, message: 'Recipe ID not registered' })
    }
    // INSERT INTO comment (comment) VALUES ("")
    const addToDb = await comments.createComment({ comment, userId, recipeId })

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

const getComments = async (req, res) => {
  try {
    const { id } = req.params
    const { sort } = req.query

    let getAllComments

    if (sort === 'id') {
      getAllComments = await comments.getCommentsSortId()
    } else {
      getAllComments = await comments.getAllComments()
    }
    if (id) {
      const getSelectedComment = await comments.getCommentsById({ id })

      if (getSelectedComment.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          data: getSelectedComment
        })
      } else {
        throw new Error('Data is empty, please try again')
      }
    } else {
      if (getAllComments.length > 0) {
        res.status(200).json({
          status: true,
          message: 'Retrieved successfully',
          total: getAllComments.length,
          data: getAllComments
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

const editComment = async (req, res) => {
  try {
    const { id } = req.params
    const { comment, userId, recipeId } = req.body

    if (userId) {
      const checkUserId = await comments.checkUserComment({ userId })

      if (checkUserId.length >= 1) {
        throw new Error({ code: 401, message: 'User ID cannot be changed' })
      }
    }

    if (recipeId) {
      const checkRecipeId = await comments.checkRecipeComment({ recipeId })

      if (checkRecipeId.length >= 1) {
        throw new Error({ code: 401, message: 'Recipe ID cannot be changed' })
      }
    }

    const getComments = await comments.getCommentsById({ id })

    if (getComments && getComments.length > 0) {
      // INSERT INTO comment_recipe (comment) VALUES ("")
      await comments.editComment({ id, comment, userId, recipeId, getComments })
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

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    const checkId = await comments.getCommentsById({ id })

    if (checkId.length === 0) {
      throw new Error({ code: 401, message: 'Data is empty' })
    }
    await comments.deleteComment({ id })

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

module.exports = { createComment, getComments, editComment, deleteComment }
