const dateAndTime = require('date-and-time')

exports.formatDate = function(rawDate) {
  const convert = dateAndTime.format(new Date(rawDate), 'MM/DD/YYYY h:mm A')
  return convert
}
