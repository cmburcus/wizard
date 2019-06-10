const { print } = require('gluegun/print')
const project = require.main.yaml('config/project.yaml')

const command = {
  name: 'migrate:latest',
  description: 'Run all migrations that have not yet been run',
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

    const timer = context.startTimer()

    try {
      // Migrating database
      await context.executeCommandInsideContainer(
        projectEnvironment.bins.app,
        projectEnvironment.commands.migrateLatest
      )

      context.printExecutionTime(timer)
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
  print.info('  migrate:latest [options]')
  print.info('')
  print.info('  Docker container must already be running')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
