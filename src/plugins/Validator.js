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
   * 检验某个字段的校验是否通过
   * @param val
   * @param rules
   * @returns {*}
   */
  verify(val, rules, name) {
    let res = {}
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      if (!rule.fun(val)) {
        res = {
          pass: false,
          msg: rule.msg || '默认校验不通过消息'
        }
        // vm.$data.vic = { [rules.name]: res }
        this.vm.$set(this.vm[this.validateKey], name, res)
        return res
      }
    }
    res = {
      pass: true,
      msg: '校验通过'
    }
    // console.log(ValidatePlugin.validation)
    this.vm.$set(this.vm[this.validateKey], name, res)
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

  initEvent(el) {
    this.ref.addEventListener('change', e => {
      this.verify(e.target.value, this.rules[e.target.name], e.target.name)
    })
    // 当鼠标聚焦时，这个表单元素需要正常
    this.ref.addEventListener('click', ({ target }) => { // 用 click 来模拟 focus 事件
      if (target.nodeName === 'INPUT' || target.nodeName === 'SELECT' || target.nodeName === 'TEXTAREA') {
        this.vm.$set(this.vm[this.validateKey], target.name, { pass: true })
        this.prevTarget = target
      }
    }, true)
    // 绑定提交事件
    el.addEventListener('click', e => {
      e.preventDefault()
      if (this.autoCatch) {
        const { pass } = this.checkAll()
        if (pass) {
          this.submitMethod()
        }
      } else {
        this.submitMethod()
      }
    })
    // 模拟 blur 事件
    window.addEventListener('click', e => {
      if (e.target !== this.prevTarget && this.prevTarget !== null) {
        this.verify(this.prevTarget.value, this.rules[this.prevTarget.name], this.prevTarget.name)
      }
    }, true)
  }
}