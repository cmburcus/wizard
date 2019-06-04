const { print } = require('gluegun/print')
const project = require.main.yaml('config/project.yaml')

const command = {
  name: 'env:logs',
  description: 'Display docker container logs',
  types: [project.types.backend.express],
  run: async context => {
    const { parameters } = context

    if (!context.canRunCommand(command)) {
      return
    }

    // Display help if requested
    if (parameters.options.h || parameters.options.help) {
      printHelp(context)

      return
    }

    /// ////////////////////////////////
    // RUNNING COMMANDS
    /// ////////////////////////////////
    const projectEnvironment = context.getProjectEnvironment()

    try {
      const container = !parameters.options.db
        ? projectEnvironment.bins.app
        : projectEnvironment.bins.database

      const options = []

      if (parameters.options.f) {
        options.push('-f')
      }

      if (parameters.options.t) {
        options.push('-t')
      }

      context.displayContainerLogs(container, options)
    } catch (error) {
      print.error(error.stack)
    }
  }
}

module.exports = command

/**
 * Prints the help message of this command
 */
function printHelp (context) {
  context.helpHeader()

  // Usage
  context.helpUsageTitle()
  print.info('  env:logs [options]')
  print.info('')
  print.info('  Docker container must already be running')
  print.info('  By default, the node container logs are displayed')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('  -f        '.green + '\t\tFollow log output')
  print.info('  -t        '.green + '\t\tShow timestamps')
  print.info('')
  print.info(' --db        '.green + '\t\tShow database container logs')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
