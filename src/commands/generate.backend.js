// Prompts
const newProjectPrompts = require('../config/prompts/new-project')

// Project types
const project = require.main.yaml('config/project.yaml')

// Project paths
const paths = require.main.yaml('config/generation/express/structure.yaml')
const template = paths.templates.express
const globals = paths.globals
const core = paths.core
const utils = paths.core_utils

// Others
const { print } = require('gluegun/print')

const command = {
  name: 'generate:backend',
  description: 'Generate an express application',
  types: [],
  run: async context => {
    const { parameters, prompt } = context

    if (!context.canRunCommand(command)) {
      return
    }

    // Display help if requested
    if (parameters.options.h || parameters.options.help) {
      printHelp(context)

      return
    }

    print.info(`Generating ${project.types.backend.express}...`.yellow)

    // Gathering project information
    const questions = newProjectPrompts.filter(
      question =>
        typeof question.projectType === 'undefined' ||
        question.projectType === project.types.backend.express
    )

    let answers = await prompt.ask(questions)

    // Project name cannot have spaces so we'll convert them to underscores
    answers.projectNameAlias = answers.projectName.toLowerCase().replace(' ', '_')

    // For now the project type is always express so we'll hardcode it
    answers = {
      ...answers,
      projectType: project.types.backend.express
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

module.exports = command

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
  print.info(`  ${command.description}`)
}
