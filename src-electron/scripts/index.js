/**
 *  The inject script to target url
 */

const { init: defaultInitScript } = require('./default')

let defaultInit = `(${defaultInitScript.toString()})()`

export { defaultInit }
