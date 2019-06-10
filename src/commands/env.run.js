const { print } = require('gluegun/print')
const project = require.main.yaml('config/project.yaml')

const command = {
  name: 'env:run',
  description: 'Runs the app in the docker container',
  types: [project.types.backend.express, project.types.frontend.react],
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

    const timer = context.startTimer()

    try {
      // Run the app
      context.executeCommandInsideContainer(
        projectEnvironment.bins.app,
        projectEnvironment.commands.runApp,
        typeof parameters.options.d !== 'undefined'
      )

      if (parameters.options.d) {
        context.printExecutionTime(timer)
      }
    } catch (error) {
      if (error.status !== 130) {
        print.error(error.stack)
      }
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
  print.info('  env:run [options]')
  print.info('')
  print.info('  Docker container must already be running')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('      --d'.green + '\t\tRuns in detached mode')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
