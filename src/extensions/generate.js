/**
 * Functions used when generating new content
 */
module.exports = context => {
  const { print, prompt, filesystem } = context

  /**
   * Attempts to add dependencies to the file provided. If the
   * dependency already exists, it will be ignored even if the version
   * is different.
   */
  context.addDependencies = async (file, dependenciesMap) => {
    const dependenciesFile = await filesystem.read(file, 'json')

    const processed = {
      dependencies: {
        added: [],
        skipped: []
      },
      devDependencies: {
        added: [],
        skipped: []
      }
    }

    // Looping through the keys allows us to loop through both global and dev dependencies
    Object.keys(dependenciesMap).forEach(type => {
      dependenciesMap[type].forEach(dependency => {
        if (typeof dependenciesFile[type][dependency.name] === 'undefined') {
          processed[type].added.push(dependency)
          dependenciesFile[type][dependency.name] = dependency.version
        } else {
          processed[type].skipped.push(dependency)
        }
      })

      // Reorder dependencies
      const orderedDependencies = {}
      Object.keys(dependenciesFile[type])
        .sort()
        .forEach(key => {
          orderedDependencies[key] = dependenciesFile[type][key]
        })

      dependenciesFile[type] = orderedDependencies
    })

    // Save the file if there are new dependencies
    if (processed.dependencies.added.length > 0 || processed.devDependencies.added.length > 0) {
      await filesystem.write(file, dependenciesFile)
    }

    // Print the changes
    Object.keys(processed).forEach(type => {
      processed[type].added.forEach(addedDependency => {
        print.info(
          `${file}: `.yellow + `New ${type} ${addedDependency.name}@${addedDependency.version}`
        )
      })

      processed[type].skipped.forEach(skippedDependency => {
        print.info(
          `${file}: Skipped ${type} ${skippedDependency.name}@${
            skippedDependency.version
          } (duplicate)`.red
        )
      })
    })
  }

  /**
   * Adds variables to the .env file
   */
  context.addEnvironmentVariables = async (files, environmentVariables) => {
    let text = ''

    // Adding a comment if one exists
    if (typeof environmentVariables.comment !== 'undefined') {
      text += `\n# ${environmentVariables.comment}\n`
    }

    // Mapping the keys with the values
    environmentVariables.variables.forEach(environmentVariable => {
      if (typeof environmentVariable.generate !== 'undefined') {
        environmentVariable.value = context.generateKey(environmentVariable.generate)
      }

      text += `${environmentVariable.key}=${environmentVariable.value}\n`
    })

    // Write the changes to the files
    files.forEach(async file => {
      await filesystem.append(file, text)

      // Print the changes
      environmentVariables.variables.forEach(environmentVariable => {
        print.info(`${file}: `.yellow + `New variable ${environmentVariable.key} added`)
      })
    })
  }

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

  /**
   * Returns an array of objects that can be used by gluegun to generate files based on templates
   *
   * The source is the place where the file can be located (usually the template folder)
   * The destination is where the file should go if you are not already in the folder (like when generating a new project)
   * The structure has to follow a specific format otherwise the results will not be accurate
   * The props are objects used throughout the templates. If no values are used, an empty object can be passed or null
   *
   * "parent": name to be referenced by
   * Note: you can ignore the path if it's the root of a project folder
   * Note: Parents can be nested to created a subfolder structure
   *
   * structure: {
   *   "parent": {
   *     "path": "relative path from the root of the project (not required)",
   *     "files": [
   *       "path/to/file"
   *     ]
   *     ...
   *   }
   * }
   */
  context.createFileMap = (source, destination, structure, props) => {
    let fileMap = []

    Object.entries(structure).forEach(entry => {
      const key = entry[0]
      const value = entry[1]

      if (key === 'files' && Array.isArray(value)) {
        value.forEach(file => {
          fileMap.push({
            template: source ? `${source}/${file}.ejs` : `${file}.ejs`,
            target: destination ? `${destination}/${file}` : file,
            props: props
          })
        })
      } else if (key !== 'files' && key !== 'path') {
        fileMap = [...fileMap, ...context.createFileMap(source, destination, value, props)]
      }
    })

    return fileMap
  }

  /**
   * Generates the folder structure for a project
   *
   * The destination is where the filders should go if you are not already in the folder (like when generating a new project)
   * The structure has to follow a specific format otherwise the results will not be accurate
   *
   * "parent": name to be referenced by
   * Note: you can ignore the path if it's the root of a project folder
   * Note: Parents can be nested to created a subfolder structure
   *
   * structure: {
   *   "parent": {
   *     "path": "relative path from the root of the project (not required)",
   *     "files": [
   *       "path/to/file"
   *     ]
   *     ...
   *   }
   * }
   */
  context.createFolderMap = (destination, structure) => {
    let folderMap = []

    Object.entries(structure).forEach(entry => {
      const key = entry[0]
      const value = entry[1]

      if (key === 'path') {
        folderMap.push(destination ? `${destination}/${value}` : value)
      } else if (key !== 'files') {
        folderMap = [...folderMap, ...context.createFolderMap(destination, value)]
      }
    })

    return folderMap
  }

  /**
   * Adds routes to the config routes file for the backend
   */
  context.generateKey = length => {
    let text = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&&*()-_'

    for (let index = 0; index < length; index++) {
      text += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return text
  }

  /**
   * Generates a project in the folder provided using the files from the maps
   */
  context.generateProject = async (folder, folderMaps, fileMaps) => {
    if (await prompt.confirm('Generate?')) {
      folderMaps.forEach(async folderMap => {
        filesystem.dir(folderMap)
      })

      fileMaps.forEach(async fileMap => {
        await context.template.generate(fileMap)
      })

      print.info(`Project generated in folder : ${folder}`.green)

      return
    }

    print.info(`Exiting...`.yellow)
  }
}
