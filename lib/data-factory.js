
'use strict'

var BlankNode = require('./blank-node')
var DefaultGraph = require('./default-graph')
var Literal = require('./literal')
var NamedNode = require('./named-node')
var Quad = require('./quad')
var Variable = require('./variable')

function DataFactory (prefixMap) {
  this._prefixes = {}
  if (prefixMap) this.addPrefixes(prefixMap)
  this.defaultGraphInstance = new DefaultGraph()
}

DataFactory.prototype.namedNode = function (value) {
  var index = value.indexOf(':')
  if (index > 0) {
    var namespace = this._prefixes[value.slice(0, index)]
    if (namespace) value = namespace + value.slice(index + 1)
  }
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

DataFactory.prototype.addPrefix = function (prefix, namespace) {
  this._prefixes[prefix] = namespace
  return this
}

DataFactory.prototype.delPrefix = function (prefix) {
  delete this._prefixes[prefix]
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

DataFactory.prototype.delPrefixes = function (prefixMapOrArr) {
  var arr = Array.isArray(prefixMapOrArr) ? prefixMapOrArr : Object.keys(prefixMapOrArr)
  for (var a = 0; a < arr.length; a += 1) {
    this.delPrefix(arr[a])
  }
  return this
}

module.exports = new DataFactory()
module.exports.DataFactory = DataFactory
