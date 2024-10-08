const project = require.main.yaml('config/project.yaml')

/**
 * Functions used when generating new content
 */
module.exports = context => {
  const { print, prompt, filesystem } = context

  let projectConfig = null
  const wizard = filesystem.read('.wizard')

  if (wizard) {
    projectConfig = JSON.parse(wizard)
  }

  /**
   * Attempts to add dependencies to the file provided. If the
   * dependency already exists, it will be ignored even if the version
   * is different.
   */
  context.addDependencies = async (file, dependenciesMap, silent) => {
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

    // We won't print the changes if silent mode is active
    if (silent) {
      return
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
    const appRoutes = await filesystem.read(file, 'json')

    routes.forEach(route => {
      appRoutes.push({
        route: route.name,
        path: route.path,
        version: route.version || 'v1'
      })
    })

    await filesystem.write(file, appRoutes)

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
   * Can run migrate:make or seed:make commands inside the container
   *
   * @param structure Structure object for database folder as specified in structure.yaml
   * @param type Types as
   * @param name String to define the filename
   */
  context.generateDatabaseFile = (structure, type, name) => {
    if (!projectConfig) {
      return
    }

    print.warning(`Creating ${type} file`)

    const template = `${structure.path}/${type}.stub`

    // Make it all lowercase and replace spaces with underscores
    let filename = name.toLowerCase().replace(' ', '_')

    let filepath = null

    if (type === project.migrations.migration) {
      filepath = structure.migrations.path
      filename = `${getDateTimeString()}_${filename}`
    } else if (type === project.migrations.seed) {
      filepath = structure.seeds.path
    }

    if (!filepath) {
      throw new Error(`No path found for ${type}`)
    }

    const file = `${filepath}/${filename}.ts`

    filesystem.copy(template, file)
    print.info('New file: '.green + file)

    print.info('')
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

/**
 * Returns a string representing the current date and time.
 *
 * Example of ISO string date: 2019-06-04T16:33:35.147Z
 * We'll just remove all the characters in between the numbers and take
 * the first 14 characters which represent the date and time including the
 * seconds
 *
 * Typically used to prefix files like migrations
 */
function getDateTimeString () {
  return new Date()
    .toISOString()
    .replace(/[-:.T]/g, '')
    .substr(0, 14)
}
