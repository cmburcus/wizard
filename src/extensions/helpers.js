/**
 * Helper functions for wizard
 */
module.exports = context => {
  const { system, print } = context

  /**
   * Returns the timer instance
   */
  context.startTimer = () => {
    return system.startTimer()
  }

  /**
   * Prints the execution time in seconds
   */
  context.printExecutionTime = timer => {
    const seconds = timer() * 0.001

    print.info(`Executed in ${Math.round(seconds * 100) / 100}s.`)
  }
}
