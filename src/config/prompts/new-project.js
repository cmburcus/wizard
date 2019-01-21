// Data validators
const generalValidator = require('../../validators/general')
const newProjectValidator = require('../../validators/newProject')

// List options
const projectTypes = require('../../config/project-types')
const nodeVersions = require('../../config/node-versions')

module.exports = [{
  type: 'input',
  name: 'projectName',
  message: 'Project name :',
  validate: newProjectValidator.validateProjectName
}, {
  type: 'input',
  name: 'authorName',
  message: 'Author name :',
  validate: newProjectValidator.validateAuthorName
}, {
  type: 'input',
  name: 'folderName',
  message: 'Folder name :',
  validate: newProjectValidator.validateFolderName
}, {
  type: 'list',
  name: 'nodeVersion',
  message: 'Node version',
  choices: nodeVersions,
  validate: generalValidator.isRequired,
  projectType: projectTypes.backendExpress
}]
