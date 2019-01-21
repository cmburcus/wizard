const { print } = require('gluegun/print')
const { bins } = require('../config/environment')
const childProcess = require('child_process')

const description = 'Runs the app in the docker container'

module.exports = {
  name: 'env:run',
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
      print.warning('Running app in docker container')
      print.info('Command: '.yellow + `docker-compose exec ${parameters.options.d ? '-d ' : ''} ${bins.node} yarn node:dev`.muted)
      print.info('')

      const options = []

      if (parameters.options.d) {
        options.push('-d')
      }

      await childProcess.execFileSync('docker-compose', [
        'exec',
        ...options,
        bins.node,
        'yarn',
        'node:dev'
      ], {stdio: 'inherit'})
      print.info('')

      if (parameters.options.d) {
        print.info(`Executed in ${timer() * 0.001} s`)
      }
    } catch (error) {
      if (error.status !== 130) {
        print.error(error.stack)
      }
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
  print.info(`  ${description}`)
}
