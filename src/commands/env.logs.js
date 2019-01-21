const { print } = require('gluegun/print')
const { bins } = require('../config/environment')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')

const description = 'Display docker container logs'

module.exports = {
  name: 'env:logs',
  description: description,
  run: async (context) => {
    const { parameters } = context

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
    try {
      print.warning('Displaying docker container logs')
      print.info('Command: '.yellow + `docker-compose logs ${parameters.options.f ? '-f ' : ''}${parameters.options.t ? '-t ' : ''}${bins.node} bash`.muted)
      print.info('')

      const options = []

      if (parameters.options.f) {
        options.push('-f')
      }

      if (parameters.options.t) {
        options.push('-t')
      }

      await childProcess.execFileSync('docker-compose', [
        'logs',
        ...options,
        bins.node
      ], {stdio: 'inherit'})
      print.info('')
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
  print.info('  env:logs [options]')
  print.info('')
  print.info('  Docker container must already be running')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('  -f        '.green + '\t\tFollow log output')
  print.info('  -t        '.green + '\t\tShow timestamps')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
