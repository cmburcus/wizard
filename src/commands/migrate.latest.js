const { print } = require('gluegun/print')
const { bins } = require('../config/environment')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')

const description = 'Run all migrations that have not yet been run'

module.exports = {
  name: 'migrate:latest',
  description: description,
  run: async context => {
    const { parameters, system } = context

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

    try {
      print.warning('Running latest migrations')
      print.info(
        'Command: '.yellow +
          `docker exec -it ${bins.node} ${bins.knex} --knexfile ${bins.knexfile} migrate:latest`
            .muted
      )
      print.info('')

      await childProcess.execFileSync(
        'docker',
        ['exec', '-it', bins.node, bins.knex, '--knexfile', bins.knexfile, 'migrate:latest'],
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
  print.info(`  ${description}`)
}
