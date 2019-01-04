import defaultRules from './Rules/Rules'

const createLengthValidate = rule => {
  const reg = /^(m(ax|in):(\d+))(\sm(ax|in):(\d+)){0,1}$/
  const [ , , p2, p3, p4, p5, p6 ] = rule.match(reg)
  let min, max
  p2 === 'in' ? min = p3 : max = p3
  if (p4 && p2 !== p5) {
    p5 === 'ax' ? max = p6 : min = p6
  }
  if ((min && max) && (~~min > ~~max)) throw new Error('最小长度不能大于最大长度')
  return ({length}) => !((min && ~~min > length) || (max && ~~max < length))
}

const createValidator = validator => {
  if (typeof validator === 'string') {
    if (defaultRules.rules[validator]) {
      return defaultRules.rules[validator]
    } else if (validator === 'required') {
      return val => !!val
    } else if (/^(m(ax|in):(\d+))(\sm(ax|in):(\d+)){0,1}$/.test(validator)) {
      return createLengthValidate(validator)
    } else {
      throw new Error(`您还未定义 ${validator} 这条规则`)
    }
  } else if (validator instanceof RegExp) {
    return val => validator.test(val)
  } else if (typeof validator === 'function') {
    return validator
  } else {
    throw new Error('validator 的值只能为函数或正则表达式')
  }
}

/**
 * 从后面往前面校验，一旦遇到校验不通过，就更新消息并返回。for 循环之后，返回正常消息
 * @param name
 * @param value
 * @param rules
 */
export const verifySingle = (name, value, rules) => {
  rules = [ ...rules ]
  const required = rules.some(rule => rule.validator === 'required')
  for (let i = 0; i < rules.length; i++) {
    const { msg, validator } = rules[i]
    if (value === '' && !required) {
      return { name, valid: true, msg: '', validator }
    } else if (!createValidator(validator)(value)) {
      return { name, valid: false, msg: msg || '默认校验不通过消息', validator }
    }
  }
  return { name, valid: true, msg: '' }
}

export const verifyAll = (data, ruleConfig) => {
  const result = Object.keys(data).reduce((res, name) => res[name] = verifySingle(name, data[name], ruleConfig[name]), {})
  console.log('result', result)
}