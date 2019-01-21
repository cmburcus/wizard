const { build } = require('gluegun')

/**
 * Create the cli and kick it off
 */
async function run (argv) {
  // create a CLI runtime
  const cli = build()
    .brand('wizard')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'wizard-*', hidden: true })
    .version() // provides default for version, v, --version, -v
    .create()

  // and run it
  const context = await cli.run(argv)

  // send it back (for testing, mostly)
  return context
}

module.exports = { run }
