/**
 * Generates a project in the folder provided using the files from the maps
 */
module.exports = context => {
  const { print, prompt, filesystem } = context

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
