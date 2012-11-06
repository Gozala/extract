# extract

[![Build Status](https://secure.travis-ci.org/Gozala/extract.png)](http://travis-ci.org/Gozala/extract)

Library provides a decorator function that can be used to for extracting
arrays parameters into arguments. This just a small taste of upcoming
[destructuring][] in JS. Here is an example:


```js
[
  ["a", "b"],
  ["c", "d"],
  ["e", "f"]
].reduce(extract(function(result, first, second) {
  result[first] = second
  return result
}), {}) // => {a: "b", c: "d", e: "f"}
```

As you can see from the example first array parameter was extracted and
applied to a decorated function as arguments. Also note that implementation
is smart about first array param extraction and ignores empty arrays and
only lears about index of extraction param ones:

```js
function keyvalues(object) {
  return Object.keys(object).map(function(key) {
    return [key, object[key]]
  })
}

var actual = keyValues({
  a: "b",
  c: "d",
  e: "f"
}).reduce(extract(function(result, key, value) {
  result.push(key, value)
  return result
}), [])
```

Finally if you need to extract other parameter than first arary argument,
or wish to be explicit there is an optional second argument to do exactly
that.


## Install

    npm install extract


[destructuring]:http://wiki.ecmascript.org/doku.php?id=harmony:destructuring
