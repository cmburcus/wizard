const { builds } = require('../config/environment')

module.exports = (context) => {
  /**
   * Based on the options provided, returns the type of build
   *
   * @param { option: boolean } options
   */
  context.getBuildType = (options) => {
    if (typeof options[builds.prod] !== 'undefined') {
      return builds.prod
    }

    if (typeof options[builds.test] !== 'undefined') {
      return builds.test
    }

    return builds.dev
  }
}
