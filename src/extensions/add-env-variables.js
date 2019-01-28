module.exports = (context) => {
  const { filesystem } = context

  /**
   * Adds variables to the .env file
   */
  context.addEnvironmentVariables = async (groupVariables) => {
    let text = ''

    groupVariables.forEach(group => {
      text += `\n# ${group.comment}\n`
      group.variables.forEach(variable => {
        text += `${variable.key}=${variable.value}\n`
      })
    })

    await filesystem.append('.env', text)
  }
}
