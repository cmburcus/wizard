// Prompts
const newProjectPrompts = require('../config/prompts/new-project')

// Project types
const project = require.main.yaml('config/project.yaml')

const { print } = require('gluegun/print')

const command = {
  name: 'generate:frontend',
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

    print.info(`Generating ${project.types.frontend.react}...`.yellow)

    const questions = newProjectPrompts.filter(
      question =>
        typeof question.projectType === 'undefined' ||
        question.projectType === project.types.frontend.react
    )

    let answers = await prompt.ask(questions)

    answers.projectNameAlias = answers.projectName.toLowerCase().replace(' ', '_')

    // For now the project type is always react so we'll hardcode it
    answers = {
      ...answers,
      projectType: project.types.frontend.react
    }

    // TODO generate the frontend project
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
  print.info('  generate:frontend [options]')
  print.info('')

  // Options
  context.helpOptionsTitle()
  print.info('  -h, --help'.green + '\t\tDisplay help message')
  print.info('')

  // Help title
  context.helpTitle()
  print.info(`  ${command.description}`)
}
