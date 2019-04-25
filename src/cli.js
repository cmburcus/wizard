const { build } = require('gluegun')

const yaml = require('js-yaml');
const fs = require('fs');

/**
 * Import a yaml file. The path should be from the root of the src directory with no leading slash
 */
function importYaml (path) {
  try {
    const file = yaml.safeLoad(fs.readFileSync(`${__dirname}/${path}`, 'utf8'));

    return file;
  } catch (e) {
    console.log(e);
  }
}

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

module.exports = { run, importYaml }
