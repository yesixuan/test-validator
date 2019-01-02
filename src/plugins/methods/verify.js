const deleteProp = (target, key) => {
  const newObj = { ...target }
  newObj[key] && delete newObj[key]
  return newObj
}

export default function(name) {
  return this._data.$vec
    ? deleteProp(this._data.$vec[name], 'validator')
    : { pass: true, msg: '' }
}