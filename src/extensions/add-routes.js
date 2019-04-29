module.exports = context => {
  const { print, filesystem } = context

  /**
   * Adds routes to the config routes file for the backend
   */
  context.addRoutes = async (file, routes) => {
    const routesFile = await filesystem.read(file)

    // Anything past this index is not important
    const routesEndIndex = routesFile.search(']; // Application routes')

    // We'll put our new routes in between these two points
    const preFile = routesFile.substring(0, routesEndIndex - 1)
    const postFile = routesFile.substring(routesEndIndex, routesFile.length)

    // Some checks to define how and where to add the new routes
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

      newRoutes += `    route: '${route.name}',\n`
      newRoutes += `    path: '${route.path}',\n`
      newRoutes += '    version: routeVersions.v1,\n'
      newRoutes += '  },'
    })

    newRoutes += '\n'

    // Write the new routes to the file
    await filesystem.write(file, preFile + newRoutes + postFile)

    // Print the changes
    routes.forEach(route => {
      print.info(`${file}: `.yellow + `New routes added for /${route.name}`)
    })
  }
}
