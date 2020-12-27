exports.createNumberArray = function(min, max) {
  var x = Array.apply(null, { length: max + 1 - min }).map(function(_, idx) {
    return idx + min
  })
  return x
  //console.log(x)
  // [ 3, 4, 5, 6, 7, 8, 9, 10 ]
}

exports.arrAdd = function(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

exports.arrRemove = function(array, value) {
  var index = array.indexOf(value)
  if (index !== -1) {
    array.splice(index, 1)
  }
}

/**
 * If value doesn't exist in array, add it.
 * If it exists, remove it
 * @param {Array} array
 * @param {Any} value
 */
exports.arrToggle = function(array, value) {
  var index = array.indexOf(value)
  if (index === -1) {
    array.push(value)
  } else {
    array.splice(index, 1)
  }
}

exports.upsertArray = function(array, item) {
  const i = array.findIndex((_item) => _item.id === item.id)
  if (i > -1) array[i] = item
  // else array.push(item)
  else array.splice(0, 0, item)
}
