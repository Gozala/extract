"use strict";

var extract = require("../extract")

exports["test extract by guess"] = function(assert) {
  var actual = [
    ["a", "b"],
    ["c", "d"],
    ["e", "f"]
  ].reduce(extract(function(result, key, value) {
    result[key] = value
    return result
  }), {})


  assert.deepEqual(actual, {a: "b", c: "d", e: "f"}, "param were extracted")
}

exports["test extract addapts to first guess"] = function(assert) {
  function keyvalues(object) {
    return Object.keys(object).map(function(key) {
      return [key, object[key]]
    })
  }

  var actual = keyvalues({
    a: "b", c: "d", e: "f"
  }).reduce(extract(function(result, key, value) {
    result.push(key, value)
    return result
  }), [])

  assert.deepEqual(actual, ["a", "b", "c", "d", "e", "f"],
                   "param extracted based on first guess")
}

exports["test extract explicit index"] = function(assert) {
  function keyvalues(object) {
    return Object.keys(object).map(function(key) {
      return [key, object[key]]
    })
  }

  var actual = keyvalues({
    a: "b", c: "d", e: "f"
  }).reduce(extract(function(result, key, value) {
    result.push(key, value)
    return result
  }, 1), [ "hello" ])

  assert.deepEqual(actual, [ "hello", "a", "b", "c", "d", "e", "f"],
                   "param extracted based explicit index")
}

exports["test throw if nothing to extract"] = function(assert) {

  assert.throws(function() {
    var f = extract(function(a, b) {
      return a + " : " + b
    })

    f(1, 2)
  }, "throws if array is not found")
}

exports["test throw on wrong index"] = function(assert) {

  assert.throws(function() {
    var f = extract(function(_, key, value) {
      return key + " : " + value
    }, 1)

    f([ "a", "b" ])

  }, "throws on wrong index")
}

require("test").run(exports)
