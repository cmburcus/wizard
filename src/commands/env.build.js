const { print } = require('gluegun/print')
const { builds, bins, dependencies } = require('../config/environment')
const childProcess = require('child_process')
const projectTypes = require('../config/project-types')

const description = 'Builds the docker containers (dev by default)'

module.exports = {
  name: 'env:build',
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
    const buildType = context.getBuildType(parameters.options)

    // First making sure the node_modules directory exists. Otherwise you will run into permission issues
    // when trying to install project dependencies
    await filesystem.dir(dependencies.nodeModules)

    // const hostUserId = await system.run('id -u')
    // const hostUserGroup = await system.run('id -g')

    const timer = system.startTimer()

    try {
      print.success(`Creating environment for ${buildType}\n`)

      // Creating docker network
      print.warning('Creating docker network')
      print.info('Command: '.yellow + `docker network create ${projectConfig.projectName}`.muted)
      await childProcess.execFileSync('docker', ['network', 'create', projectConfig.projectName], {
        stdio: 'inherit'
      })
      print.info('')

      // Building docker containers
      print.warning('Building database docker container')
      print.info(
        'Command: '.yellow +
          `docker run -d --name postgres --network ${
            projectConfig.projectName
          } -p 21000:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=${buildType} --rm postgres:10.4`
            .muted
      )
      await childProcess.execFileSync(
        'docker',
        [
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
        ],
        { stdio: 'inherit' }
      )
      print.info('')

      print.warning('Building app docker container')
      print.info(
        'Command: '.yellow +
          `docker run -dit --name node --network ${
            projectConfig.projectName
          } -p 5000:5000 -e NODE_ENV=${buildType} -v ${filesystem.cwd()}:/app -v /app/node_modules -w /app --rm node:9.11.1`
            .muted
      )
      await childProcess.execFileSync(
        'docker',
        [
          'run',
          '-u',
          'node',
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
          `${filesystem.cwd()}/node_modules:/app/node_modules`,
          '-w',
          '/app',
          '--rm',
          'node:9.11.1'
        ],
        { stdio: 'inherit' }
      )
      print.info('')

      // Installing project dependencies
      print.warning('Installing project dependencies')

      print.info('Command: '.yellow + `docker exec -it ${bins.node} yarn`.muted)
      print.info('')
      await childProcess.execFileSync('docker', ['exec', '-u', 'node', '-it', bins.node, 'yarn'], {
        stdio: 'inherit'
      })
      print.info('')

      // Compiling typescript
      print.warning('Compiling typescript')
      print.info('Command: '.yellow + `docker exec -it ${bins.node} yarn ts:build`)
      print.info('')
      await childProcess.execFileSync('docker', ['exec', '-u', 'node', '-it', bins.node, 'yarn', 'ts:build'], {
        stdio: 'inherit'
      })
      print.info('')

      // Migrating database
      // await childProcess.execFileSync('wizard', ['migrate:latest'], { stdio: 'inherit' })
      // print.info('')

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
  print.info(`      --${builds.dev}`.green + '\tBuild dev docker containers')
  print.info(`      --${builds.test}`.green + '\t\tBuild test docker containers')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
