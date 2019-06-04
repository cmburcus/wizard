const project = require.main.yaml('config/project.yaml')
const docker = require.main.yaml('config/docker.yaml')

/**
 * Functions used to get information about the project in the current directory
 */
module.exports = context => {
  const { filesystem, print } = context

  /**
   * Checks if the project can be managed by Wizard
   */
  context.isProject = () => {
    return filesystem.exists('.wizard')
  }

  /**
   * Checks if the project can be managed by Wizard and is of type Express
   */
  context.isBackendProject = () => {
    return (
      context.isProject() &&
      JSON.parse(filesystem.read('.wizard')).projectType === project.types.backend.express
    )
  }

  /**
   * Checks if the project can be managed by Wizard and is of type React
   */
  context.isFrontendProject = () => {
    return (
      context.isProject() &&
      JSON.parse(filesystem.read('.wizard')).projectType === project.types.frontend.react
    )
  }

  /**
   * Certain commands can only be run inside of a specific type of project/s.
   * This function checks the type of the project in the current folder and
   * determines whether or not the command can run
   *
   * @param command The command object that should include the project types
   */
  context.canRunCommand = command => {
    if (!command) {
      print.error('Internal error: No command was supplied')
    }

    const isProject = context.isProject()

    if (command.types.length === 0 && isProject) {
      print.error(`You can only run this command outside a project folder`)

      return false
    }

    let projectType = null
    const wizard = filesystem.read('.wizard')

    if (wizard) {
      projectType = JSON.parse(wizard).projectType
    }

    if (
      (command.types.length > 0 && !isProject) ||
      (projectType && !command.types.includes(projectType))
    ) {
      print.error(`You can only run this command in projects of type: ${command.types.join(', ')}`)

      return false
    }

    return true
  }

  /**
   * Based on the options provided, returns the type of build
   *
   * @param { option: boolean } options
   */
  context.getBuildType = options => {
    if (typeof options[docker.builds.production] !== 'undefined') {
      return docker.builds.production
    }

    if (typeof options[docker.builds.testing] !== 'undefined') {
      return docker.builds.testing
    }

    return docker.builds.development
  }

  /**
   * Returns the project environment as defined in the project.yaml config
   */
  context.getProjectEnvironment = () => {
    const projectConfig = JSON.parse(filesystem.read('.wizard'))

    return project.environment[projectConfig.projectType]
  }
}
