const { print } = require('gluegun/print')
const project = require.main.yaml('config/project.yaml')

const command = {
  name: 'env:stop',
  description: 'Stops the docker containers if they are running (dev by default)',
  types: [project.types.backend.express, project.types.frontend.react],
  run: async context => {
    const { parameters, system } = context

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
    const timer = system.startTimer()

    try {
      await context.stopDockerContainers()
      await context.removeDockerNetwork()

      print.info(`Executed in ${timer() * 0.001} s`)
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
  print.info('  env:stop [options]')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
