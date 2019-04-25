const { print } = require('gluegun/print')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')

const description = 'Stops the docker containers if they are running (dev by default)'

module.exports = {
  name: 'env:stop',
  description: description,
  run: async context => {
    const { parameters, filesystem, system } = context

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
    const projectConfig = JSON.parse(filesystem.read('.wizard'))

    const timer = system.startTimer()

    try {
      print.warning('Stopping docker containers')
      print.info('Command: '.yellow + 'docker stop node postgres')
      await childProcess.execFileSync('docker', ['stop', 'node', 'postgres'], { stdio: 'inherit' })
      print.info('')

      print.warning('Removing docker network')
      print.info('Command: '.yellow + `docker network create ${projectConfig.projectName}`.muted)
      await childProcess.execFileSync('docker', ['network', 'remove', projectConfig.projectName], {
        stdio: 'inherit'
      })
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
  print.info('  env:stop [options]')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
