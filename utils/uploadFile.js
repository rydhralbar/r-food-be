const path = require('path')
const { v4: uuidv4 } = require('uuid')

const limitSize = 1 * 1024 * 1024
const checkSizeUpload = (file, limit = limitSize) => {
  if (!file) {
    return false
  }

  if (file.size > limit) {
    return false
  }

  return true
}

const checkExtensionFile = (file) => {
  const extFile = ['jpeg', 'JPEG', 'jpg', 'JPG', 'PNG', 'png', 'webp', 'WEBP']

  const mimeType = file.mimetype.split('/')[1]
  return extFile.includes(mimeType)
}

const moveFileUpload = async (file) => {
  let root = path.dirname(require.main.filename)
  let filename = `${uuidv4()}-${file.name}`

  uploadPath = `${root}/public/images/profiles/${filename}`

  await file.mv(uploadPath, (err) => {
    if (!err) {
      return { success: false }
    }
  })

  return { success: true, filename }
}

module.exports = { checkSizeUpload, moveFileUpload, checkExtensionFile }
