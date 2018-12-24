import defaultRules from './Rules' // 默认名改成具名导出
// console.log(rules)

export default class Validator {
  constructor(el, { arg, value, value: { fields, rules, validateKey }, modifiers }, { context }) {
    this.vm = context
    this.inputValue = value
    this.ref = context.$refs[value.ref]
    this.ref.validator = this.checkAll.bind(this) // 让组件本身可以校验所有数据
    this.formData = context[value.formData]
    this.fields = fields
    this.rules = rules
    this.validateKey = validateKey
    this.autoCatch = !!modifiers.autoCatch
    this.submitMethod = this.vm[arg]
    this.prevTarget = null
    this.initEvent(el)
  }

  /**
   * 验证 validator 的值类型，将其统一包装成函数
   * @param validator
   * @returns Function
   */
  createRegValidator(validator) {
    if (typeof validator === 'string') {
      try {
        return defaultRules.rules[validator]
      } catch (e) {
        throw `您还未定义 ${validator} 这条规则`
      }
    } else if (validator instanceof RegExp) {
      return val => validator.test(val)
    } else if (typeof validator === 'function') {
      return validator
    } else {
      throw 'validator 的值只能为函数或正则表达式'
    }
  }

  createValidateData(target, name, res) {
    target = res
    this.vm.$set(this.vm[this.validateKey], name, target)
  }

  /**
   * 创建错误信息数据的偏函数（提前接收两个固定参数）
   * @param args
   * @returns {function(*=): void}
   */
  partialCreateValidateData(...args) {
    return res => {
      return this.createValidateData(...args, res)
    }
  }

  /**
   * 检验某个字段的校验是否通过
   * @param val
   * @param rules
   * @param name
   * @returns {*}
   */
  verify(val, rules, name) {
    let res = {}
    const required = rules.some(rule => rule.validator === 'required')
    const handler = this.partialCreateValidateData(res, name)
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      if (val === '' && !required) {
        handler({ pass: true, msg: '校验通过' })
        return res
      }
      if (required && val === '') {
        handler({ pass: false, msg: '必填' })
        return res
      }
      if (val !== '' && rule.validator !== 'required' && !this.createRegValidator(rule.validator)(val)) {
        handler({ pass: false, msg: rule.msg || '默认校验不通过消息' })
        return res
      }
    }
    handler({ pass: true, msg: '校验通过' })
    return res
  }

  /**
   * 提交的时候校验所有表单
   * @returns {{pass: boolean}}
   */
  checkAll() {
    let res = {
      pass: true
    }
    this.fields.forEach(item => {
      const checkOne = this.verify(this.formData[item], this.rules[item], item)
      if (!checkOne.pass && res.pass) {
        res = { ...checkOne, name: item }
      }
    })
    return res
  }

  /**
   * 这样定义方法才能保证该方法被添作事件监听者的时候 this 的指向符合预期
   * @param e
   */
  changeListener = e => {
    this.verify(e.target.value, this.rules[e.target.name], e.target.name)
  }

  focusListener = ({ target }) => {
    if (target.nodeName === 'INPUT' || target.nodeName === 'SELECT' || target.nodeName === 'TEXTAREA') {
      this.vm.$set(this.vm[this.validateKey], target.name, { pass: true })
      this.prevTarget = target
    }
  }

  submitListener = e => {
    e.preventDefault()
    if (this.autoCatch) {
      const { pass } = this.checkAll()
      if (pass) {
        this.submitMethod()
      }
    } else {
      this.submitMethod()
    }
  }

  blurListener = e => {
    if (e.target !== this.prevTarget && this.prevTarget !== null) {
      this.verify(this.prevTarget.value, this.rules[this.prevTarget.name], this.prevTarget.name)
    }
  }

  initEvent(el) {
    this.ref.addEventListener('change', this.changeListener)
    // 当鼠标聚焦时，这个表单元素需要正常
    this.ref.addEventListener('click', this.focusListener, true)
    // 绑定提交事件
    el.addEventListener('click', this.submitListener)
    // 模拟 blur 事件
    window.addEventListener('click', this.blurListener, true)
  }

  unbindEvent(el) {
    this.ref.removeEventListener('change', this.changeListener)
    this.ref.removeEventListener('click', this.focusListener, true)
    el.removeEventListener('click', this.submitListener)
    window.removeEventListener('click', this.blurListener, true)
  }
}

export const rules = defaultRules