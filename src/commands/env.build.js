const { print } = require('gluegun/print')
const { builds, bins } = require('../config/environment')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')

const description = 'Builds the docker containers (dev by default)'

module.exports = {
  name: 'env:build',
  description: description,
  run: async (context) => {
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
    const projectConfig = JSON.parse(filesystem.read('.wizard'));
    const buildType = context.getBuildType(parameters.options)

    const timer = system.startTimer()

    try {
      print.success(`Creating environment for ${buildType}\n`)

      // Creating docker network
      print.warning('Creating docker network')
      print.info('Command: '.yellow + `docker network create ${projectConfig.projectName}`.muted)
      await childProcess.execFileSync('docker', [
        'network',
        'create',
        projectConfig.projectName,
      ], { stdio: 'inherit' })
      print.info('')

      // Building docker containers
      print.warning('Building database docker container')
      print.info('Command: '.yellow + `docker run -d --name postgres --network ${projectConfig.projectName} -p 21000:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=${buildType} --rm postgres:10.4`.muted)
      await childProcess.execFileSync('docker', [
        'run',
        '-d',
        '--name',
        'postgres',
        '--network',
        projectConfig.projectName,
        '-p',
        '21000:5432',
        '-e',
        'POSTGRES_USER=postgres',
        '-e',
        'POSTGRES_PASSWORD=password',
        '-e',
        `POSTGRES_DB=${buildType}`,
        '--rm',
        'postgres:10.4'
      ], { stdio: 'inherit' })
      print.info('')

      print.warning('Building app docker container')
      print.info('Command: '.yellow + `docker run -dit --name node --network ${projectConfig.projectName} -p 5000:5000 -e NODE_ENV=${buildType} -v ${filesystem.cwd()}:/app -v /app/node_modules -w /app --rm node:9.11.1`.muted)
      await childProcess.execFileSync('docker', [
        'run',
        '-dit',
        '--name',
        'node',
        '--network',
        projectConfig.projectName,
        '-p',
        '5000:5000',
        '-e',
        `NODE_ENV=${buildType}`,
        '-v',
        `${filesystem.cwd()}:/app`,
        '-v',
        '/app/node_modules',
        '-w',
        '/app',
        '--rm',
        'node:9.11.1'
      ], { stdio: 'inherit' })
      print.info('')

      // Installing project dependencies
      print.warning('Installing project dependencies')
      print.info('Command: '.yellow + `docker exec -it ${bins.node} yarn`.muted)
      print.info('')
      await childProcess.execFileSync('docker', [
        'exec',
        '-it',
        bins.node,
        'yarn'
      ], { stdio: 'inherit' })
      print.info('')

      // Migrating database
      print.warning('Migrating database')
      print.info('Command: '.yellow + `docker exec -it ${bins.node} ${bins.knex} --knexfile database/knexfile.js migrate:latest`.muted)
      print.info('')
      await childProcess.execFileSync('docker', [
        'exec',
        '-it',
        bins.node,
        bins.knex,
        '--knexfile',
        'database/knexfile.js',
        'migrate:latest'
      ], { stdio: 'inherit' })
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
