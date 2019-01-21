const { print } = require('gluegun/print')
const { bins } = require('../config/environment')
const childProcess = require('child_process')

const description = 'Runs the tests in the docker container'

module.exports = {
  name: 'env:test',
  description: description,
  run: async (context) => {
    const { filesystem, parameters, system } = context

    if (!filesystem.exists('.wizard')) {
      print.error(`This project is not managed by Wizard`)

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
      print.warning('Running tests inside docker container')
      print.info('Command: '.yellow + `docker-compose exec ${bins.node} yarn node:test`.muted)
      print.info('')
      await childProcess.execFileSync('docker-compose', [
        'exec',
        bins.node,
        'yarn',
        'node:test'
      ], {stdio: 'inherit'})
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
  print.info('  env:test [options]')
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
