module.exports = context => {
  const { filesystem } = context

  /**
   * Attempts to add dependencies to the package.json file. If the
   * dependency already exists, it will be ignored even if the version
   * is different.
   *
   * Returns the list of dependencies that were added
   */
  context.addDependencies = async dependencies => {
    const packageFile = await filesystem.read('package.json', 'json')

    const addedDependencies = []

    dependencies.forEach(dependency => {
      if (typeof packageFile[dependency.type][dependency.name] === 'undefined') {
        addedDependencies.push(dependency)
        packageFile[dependency.type][dependency.name] = dependency.version
      }
    })

    // Reorder dependencies and devDependencies
    const orderedDependencies = {}
    Object.keys(packageFile.dependencies)
      .sort()
      .forEach(key => {
        orderedDependencies[key] = packageFile.dependencies[key]
      })

    const orderedDevDependencies = {}
    Object.keys(packageFile.devDependencies)
      .sort()
      .forEach(key => {
        orderedDevDependencies[key] = packageFile.devDependencies[key]
      })

    // Save the file if there are new dependencies
    if (addedDependencies.length > 0) {
      packageFile.dependencies = orderedDependencies
      packageFile.devDependencies = orderedDevDependencies

      // Write the package file
      await filesystem.write('package.json', packageFile)
    }

    return addedDependencies
  }
}
