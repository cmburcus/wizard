// Data validators
const generalValidator = require('../../validators/general')
const newProjectValidator = require('../../validators/newProject')

// List options
const project = require.main.yaml('config/project.yaml')

module.exports = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name :',
    validate: newProjectValidator.validateProjectName
  },
  {
    type: 'input',
    name: 'authorName',
    message: 'Author name :',
    validate: newProjectValidator.validateAuthorName
  },
  {
    type: 'input',
    name: 'folderName',
    message: 'Folder name :',
    validate: newProjectValidator.validateFolderName
  },
  {
    type: 'list',
    name: 'nodeVersion',
    message: 'Node version',
    choices: project.node,
    validate: generalValidator.isRequired,
    projectType: project.types.backend.express
  }
]
