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
    }
  ]

  const docker = [
    {
      template: 'backend-express/bare/node.dev.Dockerfile.ejs',
      target: `${answers.folderName}/node.dev.Dockerfile`,
      props: answers
    }, {
      template: 'backend-express/bare/node.test.Dockerfile.ejs',
      target: `${answers.folderName}/node.test.Dockerfile`,
      props: answers
    }, {
      template: 'backend-express/bare/docker-compose.yml.ejs',
      target: `${answers.folderName}/docker-compose.yml`
    }, {
      template: 'backend-express/bare/docker-compose.dev.yml.ejs',
      target: `${answers.folderName}/docker-compose.dev.yml`,
      props: answers
    }, {
      template: 'backend-express/bare/docker-compose.test.yml.ejs',
      target: `${answers.folderName}/docker-compose.test.yml`,
      props: answers
    }, {
      template: 'backend-express/bare/.dockerignore.ejs',
      target: `${answers.folderName}/.dockerignore`
    }
  ]

  const database = [
    {
      template: 'backend-express/bare/config/database.js.ejs',
      target: `${answers.folderName}/config/database.js`,
      props: answers
    }, {
      template: 'backend-express/bare/database/knexfile.js.ejs',
      target: `${answers.folderName}/database/knexfile.js`
    }, {
      template: 'backend-express/bare/database/migration.stub.ejs',
      target: `${answers.folderName}/database/migration.stub`
    }
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
    }
  ]

  const testing = [
    {
      template: 'backend-express/bare/nodemon.json.ejs',
      target: `${answers.folderName}/nodemon.json`
    }, {
      template: 'backend-express/bare/.nycrc.ejs',
      target: `${answers.folderName}/.nycrc`
    }, {
      template: 'backend-express/bare/test/Model.test.js.ejs',
      target: `${answers.folderName}/test/Model.test.js`
    }
  ]

  return [
    ...newProjectMap(answers.folderName),
    ...environment,
    ...docker,
    ...database,
    ...app,
    ...testing,
    {
      template: '.wizard.ejs',
      target: `${answers.folderName}/.wizard`,
      props: { projectType: projectTypes.backendExpress }
    }
  ]
}
