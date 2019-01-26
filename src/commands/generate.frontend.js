// Prompts
const newProjectPrompts = require('../config/prompts/new-project')

// Map for the types of projects
const frontendReactMap = require('../config/maps/frontend-react')

// Project types
const projectTypes = require('../config/project-types')

const { print } = require('gluegun/print')
const description = 'Generate an express application'

module.exports = {
  name: 'generate:frontend',
  description: description,
  run: async (context) => {
    const { parameters, prompt } = context

    if (!context.canRunCommand()) {
      return
    }

    // Display help if requested
    if (parameters.options.h || parameters.options.help) {
      printHelp(context)

      return
    }

    print.info(`Generating ${projectTypes.frontendReactMap}...`.yellow)

    const questions = newProjectPrompts.filter((question) => (
      typeof question.projectType === 'undefined' || question.projectType === projectTypes.frontendReactMap
    ))

    const answers = await prompt.ask(questions)

    answers.projectNameAlias = answers.projectName.toLowerCase().replace(' ', '_')

    context.generateProject(answers.folderName, frontendReactMap(answers))
  }
}

/**
 * Prints the help message of this command
 */
function printHelp (context) {
  context.helpHeader()

  // Usage
  context.helpUsageTitle()
  print.info('  generate:frontend [options]')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${description}`)
}
