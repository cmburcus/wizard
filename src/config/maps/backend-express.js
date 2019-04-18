/**
 * Map of items to be added for an express backend
 */

const newProjectMap = require('./new-project')
const projectTypes = require('../project-types')
const projectPaths = require('../paths/backend-express.json')

module.exports = (answers) => {
  const environment = [
    {
      template: `${projectPaths.templates.bare.main}/package.json.ejs`,
      target: `${answers.folderName}/package.json`,
      props: answers
    }, {
      template: `${projectPaths.templates.bare.main}/.node-version.ejs`,
      target: `${answers.folderName}/.node-version`,
      props: answers
    }, {
      template: `${projectPaths.templates.bare.main}/.gitignore.ejs`,
      target: `${answers.folderName}/.gitignore`
    }, {
      template: `${projectPaths.templates.bare.main}/.eslintrc.ejs`,
      target: `${answers.folderName}/.eslintrc`
    }, {
      template: `${projectPaths.templates.bare.main}/.env.example.ejs`,
      target: `${answers.folderName}/.env.example`
    }, {
      template: `${projectPaths.templates.bare.main}/.env.ejs`,
      target: `${answers.folderName}/.env`
    },
  ]

  const database = [
    {
      template: `${projectPaths.templates.bare.config}/database.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.config}/database.js`
    }, {
      template: `${projectPaths.templates.bare.database}/knexfile.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.database.main}/knexfile.js`
    }, {
      template: `${projectPaths.templates.bare.database}/migration.stub.ejs`,
      target: `${answers.folderName}${projectPaths.project.database.main}/migration.stub`
    },
  ]

  const app = [
    {
      template: `${projectPaths.templates.bare.src}/app.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.src}/app.js`
    }, {
      template: `${projectPaths.templates.bare.bin}/www.ejs`,
      target: `${answers.folderName}${projectPaths.project.bin}/www`,
      props: answers
    }, {
      template: `${projectPaths.templates.bare.config}/routes.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.config}/routes.js`
    }, {
      template: `${projectPaths.templates.bare.resources}/Model.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.resources}/Model.js`
    }, {
      template: `${projectPaths.templates.bare.resources}/Service.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.resources}/Service.js`
    }, {
      template: `${projectPaths.templates.bare.resources}/Controller.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.resources}/Controller.js`
    },
  ]

  const misc = [
    {
      template: `${projectPaths.templates.bare.utils.errors}/readme.md.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.errors}/readme.md`,
    }, {
      template: `${projectPaths.templates.bare.utils.errors}/index.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.errors}/index.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.errors}/types/AuthenticationError.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.errors}/types/AuthenticationError.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.errors}/types/InvalidArgumentError.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.errors}/types/InvalidArgumentError.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.errors}/types/InvalidTokenError.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.errors}/types/InvalidTokenError.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.errors}/types/NotFoundError.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.errors}/types/NotFoundError.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.errors}/types/SystemError.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.errors}/types/SystemError.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.errors}/types/ValidationError.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.errors}/types/ValidationError.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.filters}/readme.md.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.filters}/readme.md`,
    }, {
      template: `${projectPaths.templates.bare.utils.filters}/index.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.filters}/index.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.filters}/constants/filters.json.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.filters}/constants/filters.json`,
    }, {
      template: `${projectPaths.templates.bare.utils.validator}/readme.md.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.validator}/readme.md`,
    }, {
      template: `${projectPaths.templates.bare.utils.validator}/index.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.validator}/index.js`,
    }, {
      template: `${projectPaths.templates.bare.utils.validator}/config/joi.json.ejs`,
      target: `${answers.folderName}${projectPaths.project.utils.validator}/config/joi.json`,
    },
  ]

  const testing = [
    {
      template: `${projectPaths.templates.bare.main}/nodemon.json.ejs`,
      target: `${answers.folderName}/nodemon.json`
    }, {
      template: `${projectPaths.templates.bare.main}/.nycrc.ejs`,
      target: `${answers.folderName}/.nycrc`
    }, {
      template: `${projectPaths.templates.bare.test.unit.resources}/Model.test.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.test.unit.resources}/Model.test.js`
    }, {
      template: `${projectPaths.templates.bare.test.unit.resources}/Service.test.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.test.unit.resources}/Service.test.js`
    }, {
      template: `${projectPaths.templates.bare.test.unit.resources}/Controller.test.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.test.unit.resources}/Controller.test.js`
    }, {
      template: `${projectPaths.templates.bare.test.unit.utils}/errors.test.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.test.unit.utils}/errors.test.js`
    }, {
      template: `${projectPaths.templates.bare.test.unit.utils}/filters.test.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.test.unit.utils}/filters.test.js`
    }, {
      template: `${projectPaths.templates.bare.test.unit.utils}/validator.test.js.ejs`,
      target: `${answers.folderName}${projectPaths.project.test.unit.utils}/validator.test.js`
    },
  ]

  return [
    ...newProjectMap(answers.folderName),
    ...environment,
    ...database,
    ...app,
    ...misc,
    ...testing,
    {
      template: '.wizard.ejs',
      target: `${answers.folderName}/.wizard`,
      props: {
        ...answers,
        projectType: projectTypes.backendExpress,
      }
    },
  ]
}
