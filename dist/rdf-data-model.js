(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rdf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var DataFactory = require('./lib/data-factory')

module.exports = DataFactory

},{"./lib/data-factory":3}],2:[function(require,module,exports){
'use strict'

function BlankNode (id) {
  this.value = id || ('b' + (++BlankNode.nextId))
}

BlankNode.prototype.equals = function (other) {
  return other.termType === this.termType && other.value === this.value
}

BlankNode.prototype.toCanonical = function () {
  return '_:' + this.value // TODO: escape special chars
}

BlankNode.prototype.termType = 'BlankNode'

BlankNode.nextId = 0

module.exports = BlankNode

},{}],3:[function(require,module,exports){

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

},{"./blank-node":2,"./default-graph":4,"./literal":5,"./named-node":6,"./quad":7,"./variable":8}],4:[function(require,module,exports){
'use strict'

function DefaultGraph () {
  this.value = ''
}

DefaultGraph.prototype.equals = function (other) {
  return other.termType === this.termType && other.value === this.value
}

DefaultGraph.prototype.toCanonical = function () {
  return ''
}

DefaultGraph.prototype.termType = 'DefaultGraph'

module.exports = DefaultGraph

},{}],5:[function(require,module,exports){
'use strict'

const NamedNode = require('./named-node')

function Literal (value, language, datatype) {
  this.value = value

  if (language) {
    this.language = language
    this.datatype = Literal.langStringDatatype
  } else if (datatype) {
    this.datatype = datatype
  }
}

Literal.prototype.equals = function (other) {
  return other.termType === this.termType && other.value === this.value &&
    other.language === this.language && other.datatype.equals(this.datatype)
}

Literal.prototype.toCanonical = function () {
  return '"' + this.value + '"'
  // TODO: escape special chars
  // TODO: language + datatype support
}

Literal.prototype.termType = 'Literal'
Literal.prototype.language = ''
Literal.prototype.datatype = new NamedNode('http://www.w3.org/2001/XMLSchema#string')

Literal.langStringDatatype = new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')

module.exports = Literal

},{"./named-node":6}],6:[function(require,module,exports){
'use strict'

function NamedNode (iri) {
  this.value = iri
}

NamedNode.prototype.equals = function (other) {
  return other.termType === this.termType && other.value === this.value
}

NamedNode.prototype.toCanonical = function () {
  return '<' + this.value + '>' // TODO: escape special chars
}

NamedNode.prototype.termType = 'NamedNode'

module.exports = NamedNode

},{}],7:[function(require,module,exports){
'use strict'

const DefaultGraph = require('./default-graph')

function Quad (subject, predicate, object, graph) {
  this.subject = subject
  this.predicate = predicate
  this.object = object

  if (graph) {
    this.graph = graph
  }
}

Quad.prototype.equals = function (other) {
  return other.subject.equals(this.subject) && other.predicate.equals(this.predicate) &&
    other.object.equals(this.object) && other.graph.equals(this.graph)
}

Quad.prototype.toCanonical = function () {
  const graphString = this.graph.toCanonical()

  return this.subject.toCanonical() + ' ' + this.predicate.toCanonical() + ' ' + this.object.toCanonical() +
    (graphString ? (' ' + graphString) : '') + ' .'
}

Quad.prototype.graph = new DefaultGraph()

module.exports = Quad

},{"./default-graph":4}],8:[function(require,module,exports){
'use strict'

function Variable (name) {
  this.value = name
}

Variable.prototype.equals = function (other) {
  return other.termType === this.termType && other.value === this.value
}

Variable.prototype.toCanonical = function () {
  return '?' + this.value // TODO: escape special chars
}

Variable.prototype.termType = 'Variable'

module.exports = Variable

},{}]},{},[1])(1)
});