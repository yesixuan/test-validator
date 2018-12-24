import Validator from './Validator'

export default  class ValidatePlugin {
  constructor() {
    throw new Error('不允许实例化 ValidatePlugin')
  }
  static createValidator(ValidatePlugin, i, el, binding, vNode) {
  ValidatePlugin.validators[i] = new Validator(el, binding, vNode)
}
  static install(Vue, options) {
    let i = 0
    if (!ValidatePlugin.validation) {
      ValidatePlugin.validation = {}
    }
    Vue.directive('validate', {
      inserted(el, binding, vNode) {
        ValidatePlugin.validators instanceof Array || (ValidatePlugin.validators = [])
        ValidatePlugin.createValidator(ValidatePlugin, i, el, binding, vNode)
      },
      unbind() {
        // 还原校验对象
        // ValidatePlugin.validation = new Validation()
        ValidatePlugin.validators[i] = {}
      }
    })
    Vue.directive('check-submit', {
      inserted(el, {value}) {
        // const { vm, fields, formData, rules, validateKey } = ValidatePlugin.validation
        // const action = value
        ValidatePlugin.validators[i].bindSubmitEvent(el, value)
        i++
        // el.addEventListener('click', () => {
        //   const res = checkAll(fields, formData, rules, vm, validateKey)
        //   console.log(res)
        //   action()
        // })
      }
    })
  }
}
