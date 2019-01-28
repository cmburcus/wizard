const { print, filesystem } = require('gluegun')
const { version } = require('../../package')

const commandTypes = require('../config/command-types')
const projectTypes = require('../config/project-types')

/**
 * Displays help message
 */
module.exports = (context) => {
  /**
   * Prints the help header
   */
  context.helpHeader = () => {
    print.info('')
    print.info('')
    print.info('\t\tWelcome to '.green + 'Wizard'.cyan + ' CLI'.green)
    print.info(`\t\t    Version ${version}`.yellow)
    print.info('')

    print.info('      __      __'.cyan + '.__                         .___'.green)
    print.info('     /  \\    /  \\'.cyan + '__|____________ _______  __| _/'.green)
    print.info('     \\   \\/\\/   /'.cyan + '  \\___   /\\__  \\\\_  __ \\/ __ | '.green)
    print.info('      \\        /'.cyan + '|  |/    /  / __ \\|  | \\/ /_/ | '.green)
    print.info('       \\__/\\  /'.cyan + ' |__/_____ \\(____  /__|  \\____ | '.green)
    print.info('            \\/'.cyan + '           \\/     \\/           \\/ '.green)

    print.info('')
    print.info('     ============================================'.green)
    print.info('')
  }

  /**
   * Prints the usage title
   */
  context.helpUsageTitle = () => {
    print.info('Usage:'.yellow)
  }

  /**
   * Prints the options title
   */
  context.helpOptionsTitle = () => {
    print.info('Options:'.yellow)
  }

  context.helpTitle = () => {
    print.info('Help:'.yellow)
  }

  /**
   * Prints general help message
   */
  context.help = async () => {
    context.helpHeader()

    // Usage
    context.helpUsageTitle()
    print.info('  command [arguments] [options]')
    print.info('')

    // Options
    context.helpOptionsTitle()
    print.info('  -h, --help'.green + '\t\tDisplay help message')
    print.info('  -v, --version'.green + '\t\tDisplay application version')
    print.info('')

    print.info('Available commands:'.yellow)

    // Global commands
    printCommandsByType(context.plugin.commands, commandTypes.global)

    // Generator commands
    if (!context.isProject()) {
      print.info('generate'.yellow)
      printCommandsByType(context.plugin.commands, commandTypes.generateBare)
    } else if (context.isBackendExpressProject()) {
      print.info('generate'.yellow)
      printCommandsByType(context.plugin.commands, commandTypes.generateExpress)
    }

    // Environment commands
    if (context.isBackendExpressProject()) {
      print.info('environment'.yellow)
      printCommandsByType(context.plugin.commands, commandTypes.environment)
    }

    // Migration commands
    if (context.isBackendExpressProject()) {
      print.info('migrate'.yellow)
      printCommandsByType(context.plugin.commands, commandTypes.migrate)
    }

    // Seed commands
    if (context.isBackendExpressProject()) {
      print.info('seed'.yellow)
      printCommandsByType(context.plugin.commands, commandTypes.seed)
    }
  }
}

function printCommandsByType (commands, type) {
  commands.filter(command => type.indexOf(command.name) >= 0).forEach(command => {
    const commandLength = command.name.length
    let tabs = '\t\t\t'

    if (commandLength >= 14) {
      tabs = '\t'
    } else if (commandLength >= 7) {
      tabs = '\t\t'
    }

    print.info(`  ${command.name}`.green + `${tabs}${command.description}`)
  })
}
