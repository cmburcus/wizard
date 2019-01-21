const { print } = require('gluegun/print')
const { bins } = require('../config/environment')
const childProcess = require('child_process')

const description = 'SSH into the docker environment'

module.exports = {
  name: 'env:ssh',
  description: description,
  run: async (context) => {
    const { filesystem, parameters } = context

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
    try {
      print.warning('Attempting environment SSH')
      print.info('Command: '.yellow + `docker-compose exec ${bins.node} bash`.muted)
      print.info('')

      await childProcess.execFileSync('docker-compose', [
        'exec',
        bins.node,
        'bash'
      ], {stdio: 'inherit'})
      print.info('')
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
  print.info('  env:ssh [options]')
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
