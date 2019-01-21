/**
 * Map of items to be added for a react frontend
 */

const newProjectMap = require('./new-project')
const projectTypes = require('../project-types')

module.exports = (answers) => {
  const environment = []

  const docker = []

  const app = []

  const testing = []

  return [
    ...newProjectMap(answers.folderName),
    ...environment,
    ...docker,
    ...app,
    ...testing,
    {
      template: '.wizard.ejs',
      target: `${answers.folderName}/.wizard`,
      props: { projectType: projectTypes.frontendReact }
    }
  ]
}
