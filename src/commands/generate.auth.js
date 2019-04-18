const projectTypes = require('../config/project-types')
const authenticationMap = require('../config/maps/backend-express-auth')
const projectPaths = require('../config/paths/backend-express.json').project

const { print } = require('gluegun/print')
const description = 'Generates authentication components'

module.exports = {
  name: 'generate:auth',
  description: description,
  run: async (context) => {
    const { parameters, prompt, filesystem } = context

    if (!context.canRunCommand(projectTypes.backendExpress)) {
      return
    }

    // Display help if requested
    if (parameters.options.h || parameters.options.help) {
      printHelp(context)

      return
    }

    if (await prompt.confirm('Generate authentication')) {
      // Adding required files
      authenticationMap().forEach(async (map) => {
        await context.template.generate(map)
        print.info('New file: '.green + map.target)
      })

      // Adding required dependencies
      const addedDependencies = await context.addDependencies([{
        type: 'dependencies',
        name: 'bcrypt',
        version: '3.0.4',
      }, {
        type: 'dependencies',
        name: 'jsonwebtoken',
        version: '8.4.0',
      }])
      addedDependencies.forEach(dependency => {
        print.info('package.json: '.yellow + `New ${dependency.type} ${dependency.name}@${dependency.version}`)
      })

      // Adding new routes
      const routes = [{
        name: 'authentication',
        path: 'resources/authentication/routes',
      }]
      await context.addRoutes(routes)
      routes.forEach(route => {
        print.info(`${projectPaths.config}/routes.js :`.yellow + `New routes added for /${route.name}`)
      })

      // Adding JWT variables in the .env file
      const envVariableGroups = [{
        comment: 'Environment data for the JWT token',
        variables: [{
          key: 'JWT_SECRET',
          value: context.generateKey(16),
        }, {
          key: 'JWT_EXPIRES_IN',
          value: '30d'
        }],
      }]
      await context.addEnvironmentVariables(envVariableGroups)
      envVariableGroups.forEach(group => {
        group.variables.forEach(variable => {
          print.info('.env: '.yellow + `New variable ${variable.key} added`)
        })
      })

      return
    }

    print.info(`Exiting...`.yellow)
  }
}

/**
 * Prints the help message of this command
 */
function printHelp (context) {
  context.helpHeader()

  // Usage
  context.helpUsageTitle()
  print.info('  generate:auth [options]')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
