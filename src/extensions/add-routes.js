module.exports = (context) => {
  const { filesystem } = context

  /**
   * Adds routes to the config routes file for the backend
   */
  context.addRoutes = async (routes) => {
    const routesFile = await filesystem.read('config/routes.js')
    const routesEndIndex = routesFile.search(']; // Application routes')

    const preFile = routesFile.substring(0, routesEndIndex - 1)
    const postFile = routesFile.substring(routesEndIndex, routesFile.length)

    const isFirstRoute = preFile.substring(preFile.length - 2, preFile.length) === '  '
    const hasTrailingComma = preFile.charAt(preFile.length - 1) === ','

    let newRoutes = ''

    routes.forEach((route, index) => {
      if (index === 0 && isFirstRoute) {
        newRoutes += '{\n'
      } else if (index === 0 && !hasTrailingComma) {
        newRoutes += ', {\n'
      } else {
        newRoutes += ' {\n'
      }

      newRoutes += `    route: \'${route.name}\',\n`
      newRoutes += `    path: \'${route.path}\',\n`
      newRoutes += '    version: routeVersions.v1,\n'
      newRoutes += '  },'
    })

    newRoutes += '\n'

    await filesystem.write('config/routes.js', preFile + newRoutes + postFile)
  }
}
