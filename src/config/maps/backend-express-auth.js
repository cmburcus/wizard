const projectPaths = require('../paths/backend-express.json')

module.exports = () => {
  const database = [
    {
      template: `${projectPaths.templates.authentication.database.migrations}/00000000000000_create_authentications_table.js.ejs`,
      target: `${projectPaths.project.database.migrations}/00000000000000_create_authentications_table.js`,
    },
  ]

  const resources = [
    {
      template: `${projectPaths.templates.authentication.resources}/authentication/Authentication.js.ejs`,
      target: `${projectPaths.project.resources}/authentication/Authentication.js`,
    }, {
      template: `${projectPaths.templates.authentication.resources}/authentication/AuthenticationService.js.ejs`,
      target: `${projectPaths.project.resources}/authentication/AuthenticationService.js`,
    }, {
      template: `${projectPaths.templates.authentication.resources}/authentication/AuthenticationController.js.ejs`,
      target: `${projectPaths.project.resources}/authentication/AuthenticationController.js`,
    }, {
      template: `${projectPaths.templates.authentication.resources}/authentication/routes.js.ejs`,
      target: `${projectPaths.project.resources}/authentication/routes.js`,
    },
  ]

  const misc = [
    {
      template: `${projectPaths.templates.authentication.utils.jwt}/readme.md.ejs`,
      target: `${projectPaths.project.utils.jwt}/readme.md`,
    }, {
      template: `${projectPaths.templates.authentication.utils.jwt}/index.js.ejs`,
      target: `${projectPaths.project.utils.jwt}/index.js`,
    },
  ]

  const test = [
    {
      template: `${projectPaths.templates.authentication.test.unit.utils}/jwt.test.js.ejs`,
      target: `${projectPaths.project.test.unit.utils}/jwt.test.js`,
    }, {
      template: `${projectPaths.templates.authentication.test.unit.resources}/authentication/Authentication.test.js.ejs`,
      target: `${projectPaths.project.test.unit.resources}/authentication/Authentication.test.js`,
    }, {
      template: `${projectPaths.templates.authentication.test.integration.main}/authentication/api.test.js.ejs`,
      target: `${projectPaths.project.test.integration.main}/authentication/api.test.js`,
    }, {
      template: `${projectPaths.templates.authentication.test.integration.main}/authentication/AuthenticationService.test.js.ejs`,
      target: `${projectPaths.project.test.integration.main}/authentication/AuthenticationService.test.js`,
    }, {
      template: `${projectPaths.templates.authentication.test.integration.main}/authentication/validation.js.ejs`,
      target: `${projectPaths.project.test.integration.main}/authentication/validation.js`,
    },
  ]

  return [
    ...database,
    ...resources,
    ...misc,
    ...test,
  ]
}
