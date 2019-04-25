const importYaml = require('../../cli').importYaml

// Paths
const paths = importYaml('config/paths/express.yaml')
const template = paths.templates.expressAuth.path
const core = paths.core
const utils = paths.utils
const authentication = paths.authentication

module.exports = () => {
  const database = [
    {
      template: `${template}/${core.directories.src.database.migrations.path}/${
        authentication.files.database.migrations.authenticationTable
      }.ejs`,
      target: `${core.directories.src.database.migrations.path}/${
        authentication.files.database.migrations.authenticationTable
      }`
    }
  ]

  const resources = [
    {
      template: `${template}/${core.directories.src.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.resources.main.model}.ejs`,
      target: `${core.directories.src.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.resources.main.model}`
    },
    {
      template: `${template}/${core.directories.src.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.resources.main.service}.ejs`,
      target: `${core.directories.src.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.resources.main.service}`
    },
    {
      template: `${template}/${core.directories.src.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.resources.main.controller}.ejs`,
      target: `${core.directories.src.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.resources.main.controller}`
    },
    {
      template: `${template}/${core.directories.src.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.resources.main.routes}.ejs`,
      target: `${core.directories.src.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.resources.main.routes}`
    }
  ]

  const misc = [
    {
      template: `${template}/${utils.directories.jwt.path}/${utils.files.jwt.readme}.ejs`,
      target: `${utils.directories.jwt.path}/${utils.files.jwt.readme}`
    },
    {
      template: `${template}/${utils.directories.jwt.path}/${utils.files.jwt.index}.ejs`,
      target: `${utils.directories.jwt.path}/${utils.files.jwt.index}`
    }
  ]

  const test = [
    {
      template: `${template}/${utils.directories.jwt.tests.unit.path}/${
        utils.files.jwt.tests.unit.jwt
      }.ejs`,
      target: `${utils.directories.jwt.tests.unit.path}/${utils.files.jwt.tests.unit.jwt}`
    },
    {
      template: `${template}/${core.directories.src.tests.unit.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.tests.unit.resources.model}.ejs`,
      target: `${core.directories.src.tests.unit.resources.path}/${
        authentication.directories.resources.path
      }/${authentication.files.tests.unit.resources.model}`
    },
    {
      template: `${template}/${core.directories.src.tests.integration.path}/${
        authentication.directories.resources.path
      }/${authentication.files.tests.integration.api}.ejs`,
      target: `${core.directories.src.tests.integration.path}/${
        authentication.directories.resources.path
      }/${authentication.files.tests.integration.api}`
    },
    {
      template: `${template}/${core.directories.src.tests.integration.path}/${
        authentication.directories.resources.path
      }/${authentication.files.tests.integration.service}.ejs`,
      target: `${core.directories.src.tests.integration.path}/${
        authentication.directories.resources.path
      }/${authentication.files.tests.integration.service}`
    },
    {
      template: `${template}/${core.directories.src.tests.integration.path}/${
        authentication.directories.resources.path
      }/${authentication.files.tests.integration.validation}.ejs`,
      target: `${core.directories.src.tests.integration.path}/${
        authentication.directories.resources.path
      }/${authentication.files.tests.integration.validation}`
    }
  ]

  return [...database, ...resources, ...misc, ...test]
}
