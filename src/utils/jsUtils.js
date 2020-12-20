exports.createNumberArray = function(min, max) {
  var x = Array.apply(null, { length: max + 1 - min }).map(function(_, idx) {
    return idx + min
  })
  return x
  //console.log(x)
  // [ 3, 4, 5, 6, 7, 8, 9, 10 ]
}
