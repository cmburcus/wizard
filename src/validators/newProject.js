const generalValidators = require('./general')
const { filesystem } = require('gluegun/filesystem')

module.exports = {
  validateProjectName: (value) => {
    let errorCheck = generalValidators.isRequired(value)

    if (typeof errorCheck === 'string') {
      return errorCheck
    }

    errorCheck = generalValidators.maxLength(value, 30)

    if (typeof errorCheck === 'string') {
      return errorCheck
    }

    return true
  },
  validateAuthorName: (value) => {
    let errorCheck = generalValidators.isRequired(value)

    if (typeof errorCheck === 'string') {
      return errorCheck
    }

    errorCheck = generalValidators.maxLength(value, 30)

    if (typeof errorCheck === 'string') {
      return errorCheck
    }

    return true
  },
  validateFolderName: (value) => {
    let errorCheck = generalValidators.isRequired(value)

    if (typeof errorCheck === 'string') {
      return errorCheck
    }

    errorCheck = generalValidators.maxLength(value, 30)

    if (typeof errorCheck === 'string') {
      return errorCheck
    }

    if (filesystem.exists(value)) {
      return 'Folder already exists'
    }

    return true
  }
}
