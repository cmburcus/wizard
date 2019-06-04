const { print } = require('gluegun/print')
const { builds } = require.main.yaml('config/docker.yaml')
const project = require.main.yaml('config/project.yaml')

const command = {
  name: 'env:build',
  description: 'Builds the docker containers (dev by default)',
  types: [project.types.backend.express, project.types.frontend.react],
  run: async context => {
    const { parameters, system } = context

    if (!context.canRunCommand(command)) {
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
    const projectEnvironment = context.getProjectEnvironment()

    const timer = system.startTimer()

    try {
      print.success(`Creating environment for ${buildType}\n`)

      await context.createDockerNetwork()
      await context.createDockerContainers(buildType)
      await context.executeCommandInsideContainer(
        projectEnvironment.bins.app,
        projectEnvironment.commands.installDependencies
      )
      await context.executeCommandInsideContainer(
        projectEnvironment.bins.app,
        projectEnvironment.commands.typescriptBuild
      )
      await context.executeCommandInsideContainer(
        projectEnvironment.bins.app,
        projectEnvironment.commands.migrateLatest
      )

      print.info(`Executed in ${timer() * 0.001} s`)
    } catch (error) {
      print.error(error.stack)
    }
  }
}

module.exports = command

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
  print.info(`      --${builds.development}`.green + '\tBuild dev docker containers')
  print.info(`      --${builds.testing}`.green + '\t\tBuild test docker containers')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
