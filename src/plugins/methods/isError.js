export default function(name) {
  return this._data.$vec ? !this._data.$vec[name].valid : false
}
