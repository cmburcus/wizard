module.exports = (context) => {
  /**
   * Adds routes to the config routes file for the backend
   */
  context.generateKey = (length) => {
    let text = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&&*()-_'

    for (let index = 0; index < length; index++) {
      text += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return text
  }
}
