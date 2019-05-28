const { print } = require('gluegun/print')
const { filesystem } = require('gluegun/filesystem')
const childProcess = require('child_process')

const docker = require.main.yaml('config/docker.yaml')
const project = require.main.yaml('config/project.yaml')

// If this is not set as option in the child_process an error will be thrown
const stdio = { stdio: 'inherit' }

/**
 * Docker commands
 */
module.exports = context => {
  let projectConfig = null
  const wizard = filesystem.read('.wizard')

  if (wizard) {
    projectConfig = JSON.parse(wizard)
  }

  /**
   * Create a docker network
   */
  context.createDockerNetwork = async () => {
    if (!projectConfig) {
      return
    }

    print.warning('Creating docker network')

    const params = [...docker.commands.create.network, projectConfig.projectName]

    printCommand(docker.commands.command, params)
    await childProcess.execFileSync(docker.commands.command, params, stdio)
    print.info('')
  }

  /**
   * Creates the docker containers required to run the project
   *
   * @param environment The type of environement (development, testing, production)
   */
  context.createDockerContainers = environment => {
    if (!projectConfig) {
      return
    }

    let containers = []

    switch (projectConfig.projectType) {
      case project.types.backend.express:
        containers = docker.containers.express

        break
    }

    createRequiredFolders(projectConfig.projectType)

    containers.forEach(async container => {
      print.warning(`Creating ${container.name} container`)

      const params = [
        ...docker.commands.create.container,
        container.name,
        ...getRuntimeParams(container.name, environment)
      ]

      // Mapping the options as some require params
      container.options.forEach(option => {
        switch (option) {
          case 'attachToNetwork':
            params.push(docker.commands.options.attachToNetwork)
            params.push(projectConfig.projectName)

            break
          default:
            params.push(docker.commands.options[option])
        }
      })

      // Build from image
      params.push(container.image)

      printCommand(docker.commands.command, params)
      childProcess.execFileSync(docker.commands.command, params, stdio)
      print.info('')
    })
  }

  /**
   * Executes a command inside the container
   *
   * @param container Should be the container name as defined in docker.yaml
   * @param command Array of strings defining the command to run
   */
  context.executeCommandInsideContainer = (container, command) => {
    if (!projectConfig) {
      return
    }

    print.warning(command.comment)

    let runAsUser = []

    if (typeof docker.runtime[container].user !== 'undefined') {
      runAsUser.push(docker.commands.options.runAsUser)
      runAsUser.push(docker.runtime[container].user)
    }

    const params = [...docker.commands.execute, ...runAsUser, container, ...command.params]

    printCommand(docker.commands.command, params)
    childProcess.execFileSync(docker.commands.command, params, stdio)
    print.info('')
  }

  /**
   * Stops the docker containers associated with the project
   */
  context.stopDockerContainers = () => {
    if (!projectConfig) {
      return
    }

    print.warning('Stopping docker containers')

    let containers = []

    switch (projectConfig.projectType) {
      case project.types.backend.express:
        containers = docker.containers.express

        break
    }

    if (containers.length === 0) {
      print.error('No containers defined for this project')

      return
    }

    const params = [...docker.commands.stop, ...containers.map(container => container.name)]

    printCommand(docker.commands.command, params)
    childProcess.execFileSync(docker.commands.command, params, stdio)
    print.info('')
  }

  /**
   * Removes the docker network associated with the project
   */
  context.removeDockerNetwork = () => {
    if (!projectConfig) {
      return
    }

    print.warning('Removing docker network')

    const params = [...docker.commands.remove.network, projectConfig.projectName]

    printCommand(docker.commands.command, params)
    childProcess.execFileSync(docker.commands.command, params, stdio)
    print.info('')
  }
}

/**
 * Given a container name, it returns the params required for the container
 * to be ran or an empty list if an environment is not defined
 *
 * @param container The container name
 * @param environment (optional) Type of the environment (development, testing, production)
 *
 * NOTE: You only need to define the environment if a key NODE_ENV exists
 * as an environment variable
 */
function getRuntimeParams (container, environment) {
  const runtime = docker.runtime[container]
  const params = []

  if (typeof runtime === 'undefined') {
    return params
  }

  return [
    ...getEnvironmentVariables(container, environment),
    ...getPorts(container),
    ...getUser(container),
    ...getVolumes(container),
    ...getWorkingDirectory(container)
  ]
}

/**
 * Given a container name, it returns the environment variables associated with
 * the runtime or an empty list if there are none
 *
 * @param container The container name
 * @param environment (optional) Type of the environment (development, testing, production)
 *
 * NOTE: You only need to define the environment if a key NODE_ENV exists
 */
function getEnvironmentVariables (container, environment) {
  const runtime = docker.runtime[container]
  const params = []

  if (typeof runtime === 'undefined' || typeof runtime.env === 'undefined') {
    return params
  }

  runtime.env.forEach(environmentVariable => {
    const value = environmentVariable.key === 'NODE_ENV' ? environment : environmentVariable.value

    params.push(docker.commands.options.envVariable)
    params.push(`${environmentVariable.key}=${value}`)
  })

  return params
}

/**
 * Given a container name, it returns the mapped ports defined for the
 * environment or an empty list
 *
 * @param container The container name
 */
function getPorts (container) {
  const runtime = docker.runtime[container]
  const params = []

  if (typeof runtime === 'undefined' || typeof runtime.ports === 'undefined') {
    return params
  }

  params.push(docker.commands.options.mapPorts)
  params.push(`${runtime.ports.external}:${runtime.ports.internal}`)

  return params
}

/**
 * Given a container name, it returns the option to run as user based on the
 * environment definition. If not defined, an empty array will be returned
 *
 * @param container The container name
 */
function getUser (container) {
  const runtime = docker.runtime[container]
  const params = []

  if (typeof runtime === 'undefined' || typeof runtime.user === 'undefined') {
    return params
  }

  params.push(docker.commands.options.runAsUser)
  params.push(runtime.user)

  return params
}

/**
 * Gets the volumes for the container to be added as params
 * if they exist or returns an empty array
 */
function getVolumes (container) {
  const runtime = docker.runtime[container]
  const params = []

  if (typeof runtime === 'undefined' || typeof runtime.volumes === 'undefined') {
    return params
  }

  runtime.volumes.forEach(volume => {
    const host = `${filesystem.cwd()}${typeof volume.host !== 'undefined' ? volume.host : ''}`

    params.push(docker.commands.options.addVolume)
    params.push(`${host}:${volume.container}`)
  })

  return params
}

/**
 * Gets the working directory for the container to be added as params
 * if one exists or returns an empty array
 */
function getWorkingDirectory (container) {
  const runtime = docker.runtime[container]
  const params = []

  if (typeof runtime === 'undefined' || typeof runtime.workDir === 'undefined') {
    return params
  }

  params.push(docker.commands.options.workingDirectory)
  params.push(runtime.workDir)

  return params
}

/**
 * Creates required folders inside the project directory to avoid running into
 * permission issues (otherwise root would own these folders)
 */
function createRequiredFolders (projectType) {
  const folders = project.environment[projectType].folders

  if (typeof folders === 'undefined') {
    return
  }

  folders.forEach(async folder => {
    await filesystem.dir(folder)
  })
}

/**
 * Given command name and a list of params, this function will print it to
 * the terminal
 */
function printCommand (command, params) {
  const combinedCommand = [command, ...params]

  print.info('Command: '.yellow + `${combinedCommand.join(' ')}`.muted)
}
