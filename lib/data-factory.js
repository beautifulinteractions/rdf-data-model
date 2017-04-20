
'use strict'

var BlankNode = require('./blank-node')
var DefaultGraph = require('./default-graph')
var Literal = require('./literal')
var NamedNode = require('./named-node')
var Quad = require('./quad')
var Variable = require('./variable')

function DataFactory (prefixMap) {
  this.prefixes = {}
  if (prefixMap) this.addPrefixes(prefixMap)
  this.defaultGraphInstance = new DefaultGraph()
}

DataFactory.prototype.namedNode = function (value) {
  return new NamedNode(value)
}

DataFactory.prototype.blankNode = function (value) {
  return new BlankNode(value)
}

DataFactory.prototype.literal = function (value, languageOrDatatype) {
  if (typeof languageOrDatatype === 'string') {
    return (languageOrDatatype.indexOf(':') === -1)
      ? new Literal(value, languageOrDatatype)
      : new Literal(value, null, this.namedNode(languageOrDatatype))
  }
  return new Literal(value, null, languageOrDatatype)
}

DataFactory.prototype.variable = function (value) {
  return new Variable(value)
}

DataFactory.prototype.defaultGraph = function () {
  return this.defaultGraphInstance
}

DataFactory.prototype.triple = function (subject, predicate, object) {
  return this.quad(subject, predicate, object, this.defaultGraph())
}

DataFactory.prototype.quad = function (subject, predicate, object, graph) {
  return new Quad(subject, predicate, object, graph || this.defaultGraph())
}

DataFactory.prototype.expand = function (value) {
  var index = value.indexOf(':')
  if (index > 0) {
    var namespace = this.prefixes[value.slice(0, index)]
    if (namespace) value = namespace + value.slice(index + 1)
  }
  return value;
}

DataFactory.prototype.addPrefix = function (prefix, namespace) {
  this.prefixes[prefix] = namespace
  return this
}

DataFactory.prototype.removePrefix = function (prefix) {
  delete this.prefixes[prefix]
  return this
}

DataFactory.prototype.addPrefixes = function (prefixMap) {
  var prefixes = Object.keys(prefixMap)
  for (var p = 0, prefix; p < prefixes.length; p += 1) {
    prefix = prefixes[p]
    this.addPrefix(prefix, prefixMap[prefix])
  }
  return this
}

DataFactory.prototype.removePrefixes = function (prefixMapOrArr) {
  var arr = Array.isArray(prefixMapOrArr) ? prefixMapOrArr : Object.keys(prefixMapOrArr)
  for (var a = 0; a < arr.length; a += 1) {
    this.removePrefix(arr[a])
  }
  return this
}

module.exports = new DataFactory()
module.exports.DataFactory = DataFactory
