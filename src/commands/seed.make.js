const { print } = require('gluegun/print')
const project = require.main.yaml('config/project.yaml')
const structure = require.main.yaml('config/generation/express/structure.yaml')
const promptValidator = require('../validators/general')

const command = {
  name: 'seed:make',
  description: 'Create a named seed file',
  types: [project.types.backend.express],
  run: async context => {
    const { parameters, prompt } = context

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
    const timer = context.startTimer()

    let name = parameters.first

    if (typeof name === 'undefined') {
      ;({ name } = await prompt.ask({
        type: 'input',
        name: 'name',
        message: 'Name :',
        validate: promptValidator.isRequired
      }))
    }

    // Make it all lowercase and replace spaces with underscores
    name = name.toLowerCase().replace(' ', '_')

    try {
      await context.generateDatabaseFile(structure.core.src.database, project.migrations.seed, name)

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
  print.info('  seed:make <name>')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
