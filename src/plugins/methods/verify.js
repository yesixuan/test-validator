const deleteProp = (target, key) => {
  const newObj = { ...target }
  newObj[key] && delete newObj[key]
  return newObj
}

const deleteAllProp = target => {
  const newObj = { ...target }
  Object.keys(newObj).forEach(key => newObj[key] = deleteProp(newObj[key], 'validator')) // eslint-disable-line
  return newObj
}

export default function(name) {
  const verifyData = { ...this._data.$vec }
  return name
    ? verifyData
      ? deleteProp(verifyData[name], 'validator')
      : { valid: true, msg: '' }
    : verifyData
      ? deleteAllProp(verifyData)
      : {}
}
