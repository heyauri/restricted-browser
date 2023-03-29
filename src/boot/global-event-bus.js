import * as Emitter from 'tiny-emitter';
var emitter = new Emitter();

export default ({ app }) => {
    app.config.globalProperties.$global = {
        $on: (...args) => emitter.on(...args),
        $once: (...args) => emitter.once(...args),
        $off: (...args) => emitter.off(...args),
        $emit: (...args) => emitter.emit(...args)
    }
}
