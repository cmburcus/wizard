module.exports = context => {
  const { print, filesystem } = context

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
}
