const { print } = require('gluegun/print')
const project = require.main.yaml('config/project.yaml')

const command = {
  name: 'env:test',
  description: 'Runs the tests in the docker container',
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
    const runTestsCommand = !parameters.options.c ? projectEnvironment.commands.runTests : projectEnvironment.commands.runTestsWithCoverage

    if (parameters.options.file) {
      runTestsCommand.params.push(`dist/tests/**/${parameters.options.file}.test.js`)
    } else if (parameters.options.path) {
      runTestsCommand.params.push(`dist/tests/${parameters.options.path}/**/*.test.js`)
    } else {
      runTestsCommand.params.push(`dist/tests/**/*.test.js`)
    }

    const timer = context.startTimer()

    try {
      context.executeCommandInsideContainer(
        projectEnvironment.bins.app,
        runTestsCommand
      )

      context.printExecutionTime(timer)
    } catch (error) {
      // If the tests fail there will be an error thrown but we don't want to display it
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
  print.info('  env:test [options]')
  print.info('')
  print.info('  Docker container must already be running')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('  -c'.green + '\t\tDisplay test coverage')
  print.info('  --path <name>'.green + '\t\tPath from /dist/tests')
  print.info('  --file <name>'.green + '\t\tFile inside /dist/tests without .test.js')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
