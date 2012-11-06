"use strict";

module.exports = extract

var slicer = Array.prototype.slice
var isArray = Array.isArray || (function() {
  var stringifier = Object.prototype.toString
  return function isArray(value) {
    return stringifier.call(value) === "[object Array]"
  }
})()

function detectIndex(params) {
  /**
  Detects index of the param that needs to be extracted.
  **/
  var count = params.length
  var index = 0
  while (index < count) {
    var param = params[index]

    // If array is empty ignore it as it's very unlikely to be
    // an extraction target.
    if (isArray(param) && param.length) return index
    index = index + 1
  }

  throw Error("No argument to be extracted")
}

function extract(f, position) {
  /**
  Decorator function wraps given `f` function such that, input passed to
  resulting function is extracted and applied to `f`.

      [ ["a", "b"],
        ["c", "d"],
        ["e", "f"] ].reduce(extract(function(result, key, value) {
          result[key] = value
          return result
        }), {}) // => {a: "b", c: "d", e: "f"}

  Note that it's a first array parameter that is extracted, which may not
  reflect desire. There for index of parameter to be extracted can be manually
  provided as second optional argument.
  **/
  return function extractor() {
    // If position was not passed detect by finding index of first non
    // empty array. Also cache it so that subsequent calls won't do this
    // search.
    var index = position === void(0) ? (position = detectIndex(arguments)) + 1
                                     : position + 1

    var params = slicer.call(arguments, 0)
    var length = params.length
    if (length === index) {
      params.push.apply(params, params.splice(index - 1, 1)[0])
    } else if (length < index) {
      throw Error("No argument to be extracted")
    } else {
      var suffix = params.splice(index)
      params.push.apply(params, params.splice(index - 1, 1)[0])
      params.push.apply(params, suffix)
    }

    return f.apply(this, params)
  }
}
