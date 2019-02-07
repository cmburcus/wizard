module.exports = () => {
  const database = [
    {
      template: 'backend-express/authentication/database/migrations/00000000000000_create_authentications_table.js.ejs',
      target: `database/migrations/00000000000000_create_authentications_table.js`,
    },
  ]

  const resource = [
    {
      template: 'backend-express/authentication/resources/authentication/Authentication.js.ejs',
      target: 'resources/authentication/Authentication.js',
    }, {
      template: 'backend-express/authentication/resources/authentication/AuthenticationService.js.ejs',
      target: 'resources/authentication/AuthenticationService.js',
    }, {
      template: 'backend-express/authentication/resources/authentication/AuthenticationController.js.ejs',
      target: 'resources/authentication/AuthenticationController.js',
    }, {
      template: 'backend-express/authentication/resources/authentication/routes.js.ejs',
      target: 'resources/authentication/routes.js',
    },
  ]

  const misc = [
    {
      template: 'backend-express/authentication/utils/jwt.js.ejs',
      target: 'utils/jwt.js',
    },
  ]

  const test = [
    {
      template: 'backend-express/authentication/test/unit/utils/jwt.test.js.ejs',
      target: 'test/unit/utils/jwt.test.js',
    }, {
      template: 'backend-express/authentication/test/unit/resources/authentication/Authentication.test.js.ejs',
      target: 'test/unit/resources/authentication/Authentication.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/api.test.js.ejs',
      target: 'test/integration/authentication/api.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/AuthenticationService.test.js.ejs',
      target: 'test/integration/authentication/AuthenticationService.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/validation.js.ejs',
      target: 'test/integration/authentication/validation.js',
    },
  ]

  return [
    ...database,
    ...resource,
    ...misc,
    ...test,
  ]
}
