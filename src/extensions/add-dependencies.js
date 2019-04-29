module.exports = context => {
  const { print, filesystem } = context

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
}
