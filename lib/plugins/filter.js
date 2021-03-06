const Plugin = require('../plugin')
const HaltedError = require('../errors/halted')

module.exports = class Filter extends Plugin {
  filter (context, fn) {
    return fn(context) ||
      Promise.reject(new HaltedError('Filter have rejected the event'))
  }

  then (context, fn) {
    return fn(context)
  }

  on (context, ...events) {
    const res = events.find(e => {
      const types = (typeof e == 'string') ? [e] : e;
      return types.filter( type => {
        const [name, action] = type.split('.')
        return ( name === context.event ) && (!action || action === context.payload.action)
      } ).length;
    })

    return res
      ? Promise.resolve(res)
      : Promise.reject(events.join('|'))
  }
}
