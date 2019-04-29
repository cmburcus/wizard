const projectTypes = require('../config/project-types')

// Project paths
const paths = require.main.yaml('config/generation/express/structure.yaml')
const template = paths.templates.expressAuth
const authentication = paths.authentication
const utils = paths.authentication_utils

// Dependencies
const dependencies = require.main.yaml('config/generation/express/dependencies.yaml')

// Routes
const routes = require.main.yaml('config/generation/express/routes.yaml')

// Environment variables
const environment = require.main.yaml('config/generation/express/environment.yaml')

const { print } = require('gluegun/print')
const description = 'Generates authentication components'

module.exports = {
  name: 'generate:auth',
  description: description,
  run: async context => {
    const { parameters, prompt } = context

    if (!context.canRunCommand(projectTypes.backendExpress)) {
      return
    }

    // Display help if requested
    if (parameters.options.h || parameters.options.help) {
      printHelp(context)

      return
    }

    if (await prompt.confirm('Generate authentication')) {
      // Files to be generated
      const filesMap = [
        ...context.createFileMap(template, null, authentication),
        ...context.createFileMap(template, null, utils)
      ]

      // Adding required files
      filesMap.forEach(async map => {
        await context.template.generate(map)
        print.info('New file: '.green + map.target)
      })

      // Adding required dependencies
      await context.addDependencies(dependencies.file, dependencies.authentication)

      // Adding new routes
      await context.addRoutes(routes.file, routes.authentication)

      // Adding environment variables
      await context.addEnvironmentVariables(environment.files, environment.authentication)

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
