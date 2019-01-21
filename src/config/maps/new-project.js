/**
 * Map of generic items to be added to a project
 */

module.exports = (folder) => {
  return [
    {
      template: 'PULL_REQUEST_TEMPLATE.md.ejs',
      target: `${folder}/PULL_REQUEST_TEMPLATE.md`
    }, {
      template: '.prettierrc.ejs',
      target: `${folder}/.prettierrc`
    }
  ]
}
