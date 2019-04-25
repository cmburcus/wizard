/**
 * Generates a project in the folder provided using the files from the maps
 */
module.exports = context => {
  const { print, prompt } = context

  context.generateProject = async (folder, maps) => {
    if (await prompt.confirm('Generate?')) {
      maps.forEach(async map => {
        await context.template.generate(map)
      })

      print.info(`Project generated in folder : ${folder}`.green)

      return
    }

    print.info(`Exiting...`.yellow)
  }
}
