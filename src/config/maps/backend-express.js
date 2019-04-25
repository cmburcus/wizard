/**
 * Map of items to be added for an express backend
 */

const newProjectMap = require('./new-project')
const projectTypes = require('../project-types')
const importYaml = require('../../cli').importYaml

// Paths
const paths = importYaml('config/paths/express.yaml')
const template = paths.templates.express.path
const core = paths.core
const utils = paths.utils

module.exports = (answers) => {
  const environment = [
    {
      template: `${template}/${core.files.main.packageJson}.ejs`,
      target: `${answers.folderName}/${core.files.main.packageJson}`,
      props: answers
    }, {
      template: `${template}/${core.files.main.nodeVersion}.ejs`,
      target: `${answers.folderName}/${core.files.main.nodeVersion}`,
      props: answers
    }, {
      template: `${template}/${core.files.main.gitignore}.ejs`,
      target: `${answers.folderName}/${core.files.main.gitignore}`
    }, {
      template: `${template}/${core.files.main.eslintrc}.ejs`,
      target: `${answers.folderName}/${core.files.main.eslintrc}`
    }, {
      template: `${template}/${core.files.main.envExample}.ejs`,
      target: `${answers.folderName}/${core.files.main.envExample}`
    }, {
      template: `${template}/${core.files.main.env}.ejs`,
      target: `${answers.folderName}/${core.files.main.env}`
    },
  ]

  const database = [
    {
      template: `${template}/${core.directories.src.config.path}/${core.files.config.database}.ejs`,
      target: `${answers.folderName}/${core.directories.src.config.path}/${core.files.config.database}`
    }, {
      template: `${template}/${core.directories.src.database.path}/${core.files.database.knexfile}.ejs`,
      target: `${answers.folderName}/${core.directories.src.database.path}/${core.files.database.knexfile}`
    }, {
      template: `${template}/${core.directories.src.database.path}/${core.files.database.migrationStub}.ejs`,
      target: `${answers.folderName}/${core.directories.src.database.path}/${core.files.database.migrationStub}`
    },
  ]

  const app = [
    {
      template: `${template}/${core.directories.src.path}/${core.files.main.app}.ejs`,
      target: `${answers.folderName}/${core.directories.src.path}/${core.files.main.app}`
    }, {
      template: `${template}/${core.directories.bin.path}/${core.files.main.www}.ejs`,
      target: `${answers.folderName}/${core.directories.bin.path}/${core.files.main.www}`,
      props: answers
    }, {
      template: `${template}/${core.directories.src.config.path}/${core.files.config.routes}.ejs`,
      target: `${answers.folderName}/${core.directories.src.config.path}/${core.files.config.routes}`
    }, {
      template: `${template}/${core.directories.src.resources.path}/${core.files.resources.model}.ejs`,
      target: `${answers.folderName}/${core.directories.src.resources.path}/${core.files.resources.model}`
    }, {
      template: `${template}/${core.directories.src.resources.path}/${core.files.resources.service}.ejs`,
      target: `${answers.folderName}/${core.directories.src.resources.path}/${core.files.resources.service}`
    }, {
      template: `${template}/${core.directories.src.resources.path}/${core.files.resources.controller}.ejs`,
      target: `${answers.folderName}/${core.directories.src.resources.path}/${core.files.resources.controller}`
    },
  ]

  const misc = [
    {
      template: `${template}/${utils.directories.errors.path}/${utils.files.errors.readme}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.path}/${utils.files.errors.readme}`,
    }, {
      template: `${template}/${utils.directories.errors.path}/${utils.files.errors.index}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.path}/${utils.files.errors.index}`,
    }, {
      template: `${template}/${utils.directories.errors.types.path}/${utils.files.errors.types.authenticationError}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.types.path}/${utils.files.errors.types.authenticationError}`,
    }, {
      template: `${template}/${utils.directories.errors.types.path}/${utils.files.errors.types.invalidArgumentError}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.types.path}/${utils.files.errors.types.invalidArgumentError}`,
    }, {
      template: `${template}/${utils.directories.errors.types.path}/${utils.files.errors.types.invalidTokenError}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.types.path}/${utils.files.errors.types.invalidTokenError}`,
    }, {
      template: `${template}/${utils.directories.errors.types.path}/${utils.files.errors.types.notFoundError}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.types.path}/${utils.files.errors.types.notFoundError}`,
    }, {
      template: `${template}/${utils.directories.errors.types.path}/${utils.files.errors.types.systemError}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.types.path}/${utils.files.errors.types.systemError}`,
    }, {
      template: `${template}/${utils.directories.errors.types.path}/${utils.files.errors.types.validationError}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.types.path}/${utils.files.errors.types.validationError}`,
    }, {
      template: `${template}/${utils.directories.filters.path}/${utils.files.filters.readme}.ejs`,
      target: `${answers.folderName}/${utils.directories.filters.path}/${utils.files.filters.readme}`,
    }, {
      template: `${template}/${utils.directories.filters.path}/${utils.files.filters.index}.ejs`,
      target: `${answers.folderName}/${utils.directories.filters.path}/${utils.files.filters.index}`,
    }, {
      template: `${template}/${utils.directories.filters.constants.path}/${utils.files.filters.constants.filters}.ejs`,
      target: `${answers.folderName}/${utils.directories.filters.constants.path}/${utils.files.filters.constants.filters}`,
    }, {
      template: `${template}/${utils.directories.validator.path}/${utils.files.validator.readme}.ejs`,
      target: `${answers.folderName}/${utils.directories.validator.path}/${utils.files.validator.readme}`,
    }, {
      template: `${template}/${utils.directories.validator.path}/${utils.files.validator.index}.ejs`,
      target: `${answers.folderName}/${utils.directories.validator.path}/${utils.files.validator.index}`,
    }, {
      template: `${template}/${utils.directories.validator.config.path}/${utils.files.validator.config.joi}.ejs`,
      target: `${answers.folderName}/${utils.directories.validator.config.path}/${utils.files.validator.config.joi}`,
    },
  ]

  const testing = [
    {
      template: `${template}/${core.files.main.nodemon}.ejs`,
      target: `${answers.folderName}/${core.files.main.nodemon}`
    }, {
      template: `${template}/${core.files.main.nycrc}.ejs`,
      target: `${answers.folderName}/${core.files.main.nycrc}`
    }, {
      template: `${template}/${core.directories.src.tests.unit.resources.path}/${core.files.tests.unit.resources.model}.ejs`,
      target: `${answers.folderName}/${core.directories.src.tests.unit.resources.path}/${core.files.tests.unit.resources.model}`
    }, {
      template: `${template}/${core.directories.src.tests.unit.resources.path}/${core.files.tests.unit.resources.service}.ejs`,
      target: `${answers.folderName}/${core.directories.src.tests.unit.resources.path}/${core.files.tests.unit.resources.service}`
    }, {
      template: `${template}/${core.directories.src.tests.unit.resources.path}/${core.files.tests.unit.resources.controller}.ejs`,
      target: `${answers.folderName}/${core.directories.src.tests.unit.resources.path}/${core.files.tests.unit.resources.controller}`
    }, {
      template: `${template}/${utils.directories.errors.tests.unit.path}/${utils.files.errors.tests.unit.errors}.ejs`,
      target: `${answers.folderName}/${utils.directories.errors.tests.unit.path}/${utils.files.errors.tests.unit.errors}`
    }, {
      template: `${template}/${utils.directories.filters.tests.unit.path}/${utils.files.filters.tests.unit.filters}.ejs`,
      target: `${answers.folderName}/${utils.directories.filters.tests.unit.path}/${utils.files.filters.tests.unit.filters}`
    }, {
      template: `${template}/${utils.directories.validator.tests.unit.path}/${utils.files.validator.tests.unit.validator}.ejs`,
      target: `${answers.folderName}/${utils.directories.validator.tests.unit.path}/${utils.files.validator.tests.unit.validator}`
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
      template: `${core.files.main.wizard}.ejs`,
      target: `${answers.folderName}/${core.files.main.wizard}`,
      props: {
        ...answers,
        projectType: projectTypes.backendExpress,
      }
    },
  ]
}
