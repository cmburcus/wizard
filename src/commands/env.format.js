const { print } = require('gluegun/print')
const { bins } = require('../config/environment')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')

const description = 'Formats the code using eslint and prettier'

module.exports = {
  name: 'env:format',
  description: description,
  run: async (context) => {
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
      print.warning('Formatting code')
      print.info('Command: '.yellow + `docker exec -it ${bins.node} yarn format`.muted)
      print.info('')

      await childProcess.execFileSync('docker', [
        'exec',
        bins.node,
        'yarn',
        'format'
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
  print.info('  env:format [options]')
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
