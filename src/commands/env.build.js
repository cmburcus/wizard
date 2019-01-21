const { print } = require('gluegun/print')
const { builds, dockerfiles, bins } = require('../config/environment')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')

const description = 'Builds the docker containers (dev by default)'

module.exports = {
  name: 'env:build',
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
      // Building the docker containers
      print.warning('Building docker containers')
      print.info('Command: '.yellow + `docker-compose -f ${dockerfiles.main} -f ${dockerfiles[buildType]} up -d --build`.muted)
      print.info('')
      await childProcess.execFileSync('docker-compose', [
        '-f',
        dockerfiles.main,
        '-f',
        dockerfiles[buildType],
        'up',
        '-d',
        '--build'
      ], {stdio: 'inherit'})
      print.info('')

      // Installing project dependencies
      print.warning('Installing project dependencies')
      print.info('Command: '.yellow + `docker-compose exec ${bins.node} yarn`.muted)
      print.info('')
      await childProcess.execFileSync('docker-compose', [
        'exec',
        bins.node,
        'yarn'
      ], {stdio: 'inherit'})
      print.info('')

      // Migrating database
      print.warning('Migrating database')
      print.info('Command: '.yellow + `docker-compose exec ${bins.node} ${bins.knex} --knexfile database/knexfile.js migrate:latest`.muted)
      print.info('')
      await childProcess.execFileSync('docker-compose', [
        'exec',
        bins.node,
        bins.knex,
        '--knexfile',
        'database/knexfile.js',
        'migrate:latest'
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
  print.info('  env:build [options]')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info(`      --${builds.dev}`.green + '\t\tBuild dev docker containers')
  print.info(`      --${builds.test}`.green + '\t\tBuild test docker containers')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
