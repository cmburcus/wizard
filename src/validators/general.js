module.exports = {
  isRequired: (value) => {
    if (!value) {
      return 'Field required'
    }

    return true
  },
  maxLength: (value, max) => {
    if (value.length > max) {
      return `Field length must not be greater than ${max} characters`
    }
  }
}
