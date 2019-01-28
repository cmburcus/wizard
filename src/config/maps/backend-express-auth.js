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
      template: 'backend-express/authentication/test/integration/authentication/api/authenticate.test.js.ejs',
      target: 'test/integration/authentication/api/authenticate.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/api/delete.test.js.ejs',
      target: 'test/integration/authentication/api/delete.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/api/register.test.js.ejs',
      target: 'test/integration/authentication/api/register.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/api/verify.test.js.ejs',
      target: 'test/integration/authentication/api/verify.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/service/authenticate.test.js.ejs',
      target: 'test/integration/authentication/service/authenticate.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/service/delete.test.js.ejs',
      target: 'test/integration/authentication/service/delete.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/service/register.test.js.ejs',
      target: 'test/integration/authentication/service/register.test.js',
    }, {
      template: 'backend-express/authentication/test/integration/authentication/service/verify.test.js.ejs',
      target: 'test/integration/authentication/service/verify.test.js',
    },
  ]

  return [
    ...database,
    ...resource,
    ...misc,
    ...test,
  ]
}
