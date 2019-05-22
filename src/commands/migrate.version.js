const { print } = require('gluegun/print')
const { bins, knex } = require('../config/environment')
const childProcess = require('child_process')
const project = require.main.yaml('config/project.yaml')

const description = 'View the current version for the migration'

module.exports = {
  name: 'migrate:version',
  description: description,
  run: async context => {
    const { parameters, system } = context

    if (!context.canRunCommand(project.types.backend.express)) {
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
      print.warning('Checking current migration version')
      print.info(
        'Command: '.yellow +
          `docker exec -it ${bins.node} ${bins.knex} --knexfile ${
            knex.knexfile
          } migrate:currentVersion`.muted
      )
      print.info('')

      await childProcess.execFileSync(
        'docker',
        [
          'exec',
          '-it',
          bins.node,
          bins.knex,
          '--knexfile',
          knex.knexfile,
          'migrate:currentVersion'
        ],
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
  print.info('  migrate:version [options]')
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
