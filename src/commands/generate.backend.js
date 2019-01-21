// Prompts
const newProjectPrompts = require('../config/prompts/new-project')

// Map for the types of projects
const backendExpressMap = require('../config/maps/backend-express')

// Project types
const projectTypes = require('../config/project-types')

module.exports = {
  name: 'generate:backend',
  description: 'Generate an express application',
  run: async (context) => {
    const { print, prompt, filesystem } = context

    if (!context.canRunCommand()) {
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

    context.generateProject(answers.folderName, backendExpressMap(answers))
  }
}
