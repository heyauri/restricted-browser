// import * as Emitter from 'tiny-emitter';
// var emitter = new Emitter();

// export default ({ app }) => {
//     app.config.globalProperties.$global = {
//         $on: (...args) => emitter.on(...args),
//         $once: (...args) => emitter.once(...args),
//         $off: (...args) => emitter.off(...args),
//         $emit: (...args) => emitter.emit(...args)
//     }
// }

// a Quasar CLI boot file (let's say /src/boot/bus.js)

import { EventBus } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  const bus = new EventBus()

  // for Options API
  app.config.globalProperties.$global = bus

  // for Composition API
  app.provide('global', bus)
})