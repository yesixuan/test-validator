import Validator from './Validator'

/**
 * 检验某个字段的校验是否通过
 * @param val
 * @param rules
 * @param vm
 * @param validateKey
 * @returns {*}
 */
const verify = (val, rules, vm, validateKey) => {
  // console.log(validateKey)
  let res = {}
  for (let i = 0; i < rules.validator.length; i++) {
    let rule = rules.validator[i]
    if (!rule.fun(val)) {
      res = {
        pass: false,
        msg: rule.msg || '默认校验不通过消息'
      }
      // vm.$data.vic = { [rules.name]: res }
      vm.$set(vm[validateKey], rules.name, res)
      return res
    }
  }
  res = {
    pass: true,
    msg: '校验通过'
  }
  // console.log(ValidatePlugin.validation)
  vm.$set(vm[validateKey], rules.name, res)
  return res
}

/**
 * 提交的时候校验所有表单
 * @param fields 所有需要校验的数据
 * @param formData 存放表单数据的对象
 * @param rules 校验表单的规则
 * @param vm 当前表单所在的组件实例
 * @param validateKey 校验消息所存储的位置
 * @returns {{pass: boolean}}
 */
const checkAll = (fields, formData, rules, vm, validateKey) => {
  let res = {
    pass: true
  }
  fields.forEach(item => {
    const checkOne = verify(formData[item], rules[item], vm, validateKey)
    if (!checkOne.pass && res.pass) {
      res = { ...checkOne, name: item }
    }
  })
  return res
}

const createValidator = (ValidatePlugin, i, el, binding, vNode) => {
  ValidatePlugin.validators[i] = new Validator(el, binding, vNode)
}

const ValidatePlugin = {}
ValidatePlugin.install = function (Vue, options) {
  let i = 0
  if (!ValidatePlugin.validation) {
    ValidatePlugin.validation = {}
  }
  Vue.directive('validate', {
    inserted(el, binding, vNode) {
      ValidatePlugin.validators instanceof Array || (ValidatePlugin.validators = [])
      createValidator(ValidatePlugin, i, el, binding, vNode)
    },
    unbind() {
      // 还原校验对象
      // ValidatePlugin.validation = new Validation()
      ValidatePlugin.validators[i] = {}
    }
  })
  Vue.directive('check-submit', {
    inserted(el, { value }) {
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

export default ValidatePlugin
