module.exports = context => {
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
}
