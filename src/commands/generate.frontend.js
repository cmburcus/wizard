// Prompts
const newProjectPrompts = require('../config/prompts/new-project')

// Map for the types of projects
const frontendReactMap = require('../config/maps/frontend-react')

// Project types
const projectTypes = require('../config/project-types')

module.exports = {
  name: 'generate:frontend',
  description: 'Generate an express application',
  run: async (context) => {
    const { print, prompt } = context

    if (!context.canRunCommand()) {
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
