import Validator from './Validator'
export { rules } from './Validator'

export default  class ValidatePlugin {
  constructor() {
    throw new Error('不允许实例化 ValidatePlugin')
  }
  static createValidator(ValidatePlugin, el, binding, vNode) {
    ValidatePlugin.validators[vNode.context._uid] = new Validator(el, binding, vNode)
  }
  static install(Vue, options) {
    if (!ValidatePlugin.validation) {
      ValidatePlugin.validation = {}
    }
    Vue.directive('validate', {
      inserted(el, binding, vNode) {
        ValidatePlugin.validators instanceof Array || (ValidatePlugin.validators = [])
        ValidatePlugin.createValidator(ValidatePlugin, el, binding, vNode)
      },
      unbind(el, binding, { context }) {
        // 解绑事件
        ValidatePlugin.validators[context._uid].unbindEvent(el)
        // 通过组件的 id 来区分不同的表单
        ValidatePlugin.validators[context._uid] = null
      }
    })
  }
}
