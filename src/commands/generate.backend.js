// Prompts
const newProjectPrompts = require('../config/prompts/new-project')

// Map for the types of projects
const backendExpressMap = require('../config/maps/backend-express')

// Project types
const projectTypes = require('../config/project-types')

const { print } = require('gluegun/print')
const description = 'Generate an express application'

module.exports = {
  name: 'generate:backend',
  description: description,
  run: async (context) => {
    const { parameters, prompt, filesystem } = context

    if (!context.canRunCommand()) {
      return
    }

    // Display help if requested
    if (parameters.options.h || parameters.options.help) {
      printHelp(context)

      return
    }

    print.info(`Generating ${projectTypes.backendExpress}...`.yellow)

    const questions = newProjectPrompts.filter((question) => (
      typeof question.projectType === 'undefined' || question.projectType === projectTypes.backendExpress
    ))

    const answers = await prompt.ask(questions)

    answers.projectNameAlias = answers.projectName.toLowerCase().replace(' ', '_')

    // Create migrations & seeds folder
    filesystem.dir(`${answers.folderName}/database/migrations`)
    filesystem.dir(`${answers.folderName}/database/seeds`)
    filesystem.dir(`${answers.folderName}/test/integration`)
    filesystem.dir(`${answers.folderName}/test/unit`)

    context.generateProject(answers.folderName, backendExpressMap(answers))
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
