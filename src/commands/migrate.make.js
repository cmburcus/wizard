const { print } = require('gluegun/print')
const project = require.main.yaml('config/project.yaml')
const structure = require.main.yaml('config/generation/express/structure.yaml')
const promptValidator = require('../validators/general')

const command = {
  name: 'migrate:make',
  description: 'Create a named migration file',
  types: [project.types.backend.express],
  run: async context => {
    const { parameters, system, prompt } = context

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

    let name = parameters.first

    if (typeof name === 'undefined') {
      ;({ name } = await prompt.ask({
        type: 'input',
        name: 'name',
        message: 'Name :',
        validate: promptValidator.isRequired
      }))
    }

    try {
      // Creating migration file
      await context.generateDatabaseFile(
        structure.core.src.database,
        project.migrations.migration,
        name
      )

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
  print.info('  migrate:make <name>')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
