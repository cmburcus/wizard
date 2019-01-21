const { print } = require('gluegun/print')
const { builds, dockerfiles } = require('../config/environment')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')

const description = 'Stops the docker containers if they are running (dev by default)'

module.exports = {
  name: 'env:stop',
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
    const buildType = context.getBuildType(parameters.options)

    const timer = system.startTimer()

    try {
      print.warning('Stopping docker containers')
      print.info('Command: '.yellow + `docker-compose -f ${dockerfiles.main} -f ${dockerfiles[buildType]} down -v --remove-orphans ${parameters.options.clean ? '--rmi all' : ''}`.muted)
      print.info('')

      const options = []

      if (parameters.options.clean) {
        options.push('--rmi')
        options.push('all')
      }

      await childProcess.execFileSync('docker-compose', [
        '-f',
        dockerfiles.main,
        '-f',
        dockerfiles[buildType],
        'down',
        '-v',
        '--remove-orphans',
        ...options
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
  print.info('  env:stop [options]')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info(`      --${builds.dev}`.green + '\t\tBuild dev docker containers')
  print.info(`      --${builds.test}`.green + '\t\tBuild test docker containers')
  print.info('      --clean'.green + '\t\tRemoves images and volumes')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
