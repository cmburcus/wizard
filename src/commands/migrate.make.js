const { print } = require('gluegun/print')
const { bins, knex } = require('../config/environment')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')
const promptValidator = require('../validators/general')

const description = 'Create a named migration file'

module.exports = {
  name: 'migrate:make',
  description: description,
  run: async context => {
    const { parameters, system, prompt } = context

    if (!context.canRunCommand(projectTypes.backendExpress)) {
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

    // Make it all lowercase and replace spaces with underscores
    name = name.toLowerCase().replace(' ', '_')

    try {
      print.warning('Creating migration file')
      print.info(
        'Command: '.yellow +
          `docker exec -it ${bins.node} ${bins.knex} --knexfile ${
            knex.knexfile
          } migrate:make ${name}`.muted
      )
      print.info('')

      await childProcess.execFileSync(
        'docker',
        ['exec', '-it', bins.node, bins.knex, '--knexfile', knex.knexfile, 'migrate:make', name],
        { stdio: 'inherit' }
      )
      print.info('')

      print.info(`Executed in ${timer() * 0.001} s`)
    } catch (error) {
      print.error(error.stack)
    }
  }
}

/**
 * Prints the help message of this command
 */
function printHelp (context) {
  context.helpHeader()

  // Usage
  context.helpUsageTitle()
  print.info('  migrate:make <name>')
  print.info('')
  print.info('  Docker container must already be running')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
