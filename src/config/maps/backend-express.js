/**
 * Map of items to be added for an express backend
 */

const newProjectMap = require('./new-project')
const projectTypes = require('../project-types')

module.exports = (answers) => {
  const environment = [
    {
      template: 'backend-express/bare/package.json.ejs',
      target: `${answers.folderName}/package.json`,
      props: answers
    }, {
      template: 'backend-express/bare/.node-version.ejs',
      target: `${answers.folderName}/.node-version`,
      props: answers
    }, {
      template: 'backend-express/bare/.gitignore.ejs',
      target: `${answers.folderName}/.gitignore`
    }, {
      template: 'backend-express/bare/.eslintrc.ejs',
      target: `${answers.folderName}/.eslintrc`
    }, {
      template: 'backend-express/bare/.env.example.ejs',
      target: `${answers.folderName}/.env.example`
    }, {
      template: 'backend-express/bare/.env.ejs',
      target: `${answers.folderName}/.env`
    },
  ]

  const database = [
    {
      template: 'backend-express/bare/config/database.js.ejs',
      target: `${answers.folderName}/config/database.js`
    }, {
      template: 'backend-express/bare/database/knexfile.js.ejs',
      target: `${answers.folderName}/database/knexfile.js`
    }, {
      template: 'backend-express/bare/database/migration.stub.ejs',
      target: `${answers.folderName}/database/migration.stub`
    },
  ]

  const app = [
    {
      template: 'backend-express/bare/app.js.ejs',
      target: `${answers.folderName}/app.js`
    }, {
      template: 'backend-express/bare/bin/www.ejs',
      target: `${answers.folderName}/bin/www`,
      props: answers
    }, {
      template: 'backend-express/bare/config/routes.js.ejs',
      target: `${answers.folderName}/config/routes.js`
    }, {
      template: 'backend-express/bare/resources/Model.js.ejs',
      target: `${answers.folderName}/resources/Model.js`
    }, {
      template: 'backend-express/bare/resources/Service.js.ejs',
      target: `${answers.folderName}/resources/Service.js`
    }, {
      template: 'backend-express/bare/resources/Controller.js.ejs',
      target: `${answers.folderName}/resources/Controller.js`
    },
  ]

  const misc = [
    {
      template: 'backend-express/bare/utils/errors/readme.md.ejs',
      target: `${answers.folderName}/utils/errors/readme.md`,
    }, {
      template: 'backend-express/bare/utils/errors/index.js.ejs',
      target: `${answers.folderName}/utils/errors/index.js`,
    }, {
      template: 'backend-express/bare/utils/errors/types/AuthenticationError.js.ejs',
      target: `${answers.folderName}/utils/errors/types/AuthenticationError.js`,
    }, {
      template: 'backend-express/bare/utils/errors/types/InvalidArgumentError.js.ejs',
      target: `${answers.folderName}/utils/errors/types/InvalidArgumentError.js`,
    }, {
      template: 'backend-express/bare/utils/errors/types/InvalidTokenError.js.ejs',
      target: `${answers.folderName}/utils/errors/types/InvalidTokenError.js`,
    }, {
      template: 'backend-express/bare/utils/errors/types/NotFoundError.js.ejs',
      target: `${answers.folderName}/utils/errors/types/NotFoundError.js`,
    }, {
      template: 'backend-express/bare/utils/errors/types/SystemError.js.ejs',
      target: `${answers.folderName}/utils/errors/types/SystemError.js`,
    }, {
      template: 'backend-express/bare/utils/errors/types/ValidationError.js.ejs',
      target: `${answers.folderName}/utils/errors/types/ValidationError.js`,
    }, {
      template: 'backend-express/bare/utils/filters/readme.md.ejs',
      target: `${answers.folderName}/utils/filters/readme.md`,
    }, {
      template: 'backend-express/bare/utils/filters/index.js.ejs',
      target: `${answers.folderName}/utils/filters/index.js`,
    }, {
      template: 'backend-express/bare/utils/filters/constants/filters.json.ejs',
      target: `${answers.folderName}/utils/filters/constants/filters.json`,
    }, {
      template: 'backend-express/bare/utils/validator/readme.md.ejs',
      target: `${answers.folderName}/utils/validator/readme.md`,
    }, {
      template: 'backend-express/bare/utils/validator/index.js.ejs',
      target: `${answers.folderName}/utils/validator/index.js`,
    }, {
      template: 'backend-express/bare/utils/validator/config/joi.json.ejs',
      target: `${answers.folderName}/utils/validator/config/joi.json`,
    },
  ]

  const testing = [
    {
      template: 'backend-express/bare/nodemon.json.ejs',
      target: `${answers.folderName}/nodemon.json`
    }, {
      template: 'backend-express/bare/.nycrc.ejs',
      target: `${answers.folderName}/.nycrc`
    }, {
      template: 'backend-express/bare/test/unit/resources/Model.test.js.ejs',
      target: `${answers.folderName}/test/unit/resources/Model.test.js`
    }, {
      template: 'backend-express/bare/test/unit/resources/Service.test.js.ejs',
      target: `${answers.folderName}/test/unit/resources/Service.test.js`
    }, {
      template: 'backend-express/bare/test/unit/resources/Controller.test.js.ejs',
      target: `${answers.folderName}/test/unit/resources/Controller.test.js`
    }, {
      template: 'backend-express/bare/test/unit/utils/errors.test.js.ejs',
      target: `${answers.folderName}/test/unit/utils/errors.test.js`
    }, {
      template: 'backend-express/bare/test/unit/utils/filters.test.js.ejs',
      target: `${answers.folderName}/test/unit/utils/filters.test.js`
    }, {
      template: 'backend-express/bare/test/unit/utils/validator.test.js.ejs',
      target: `${answers.folderName}/test/unit/utils/validator.test.js`
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
