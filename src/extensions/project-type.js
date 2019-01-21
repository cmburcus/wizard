const projectTypes = require('../config/project-types')

module.exports = (context) => {
  const { filesystem, print } = context

  context.isProject = () => {
    return filesystem.exists('.wizard')
  }

  context.isBackendExpressProject = () => {
    return context.isProject() && JSON.parse(filesystem.read('.wizard')).projectType === projectTypes.backendExpress
  }

  context.isFrontendReactProject = () => {
    return context.isProject() && JSON.parse(filesystem.read('.wizard')).projectType === projectTypes.frontendReact
  }

  context.canRunCommand = (projectType) => {
    if (!projectType && context.isProject()) {
      print.error(`You can only run this command outside a project folder`)

      return false
    }

    const wrongProject = (projectType && !context.isProject()) || (projectType === projectTypes.backendExpress && !context.isBackendExpressProject()) || (projectType === projectTypes.frontendReact && !context.isFrontendReactProject())

    if (wrongProject) {
      print.error(`You can only run this command in a ${projectType} project`)
    }

    return !wrongProject
  }
}
