// Prompts
const newProjectPrompts = require('../config/prompts/new-project')

// Project types
const projectTypes = require('../config/project-types')

// Project paths
const paths = require.main.yaml('config/generation/express/structure.yaml')
const template = paths.templates.express
const globals = paths.globals
const core = paths.core
const utils = paths.core_utils

// Others
const { print } = require('gluegun/print')
const description = 'Generate an express application'

module.exports = {
  name: 'generate:backend',
  description: description,
  run: async context => {
    const { parameters, prompt } = context

    if (!context.canRunCommand()) {
      return
    }

    // Display help if requested
    if (parameters.options.h || parameters.options.help) {
      printHelp(context)

      return
    }

    print.info(`Generating ${projectTypes.backendExpress}...`.yellow)

    // Gathering project information
    const questions = newProjectPrompts.filter(
      question =>
        typeof question.projectType === 'undefined' ||
        question.projectType === projectTypes.backendExpress
    )

    let answers = await prompt.ask(questions)

    // Project name cannot have spaces so we'll convert them to underscores
    answers.projectNameAlias = answers.projectName.toLowerCase().replace(' ', '_')

    // For now the project type is always express so we'll hardcode it
    answers = {
      ...answers,
      projectType: projectTypes.backendExpress
    }

    // Folders to be generated
    const foldersMap = [
      ...context.createFolderMap(answers.folderName, core),
      ...context.createFolderMap(answers.folderName, utils)
    ]

    // Files to be generated
    const filesMap = [
      ...context.createFileMap(null, answers.folderName, globals, answers),
      ...context.createFileMap(template, answers.folderName, core, answers),
      ...context.createFileMap(template, answers.folderName, utils, answers)
    ]

    context.generateProject(answers.folderName, foldersMap, filesMap)
  }
}

/**
 * Prints the help message of this command
 */
function printHelp (context) {
  context.helpHeader()

  // Usage
  context.helpUsageTitle()
  print.info('  generate:backend [options]')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
