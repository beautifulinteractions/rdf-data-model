(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rdf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

'use strict';

const DataFactory = require('./lib/data-factory');

module.exports = new DataFactory();
module.exports.DataFactory = DataFactory;

},{"./lib/data-factory":3}],2:[function(require,module,exports){

'use strict';

class BlankNode {

  constructor(id) {
    this.value = id || ('b' + (BlankNode.nextId += 1));
  }

  equals(other) {
    return other.termType === this.termType && other.value === this.value;
  }

}

BlankNode.prototype.termType = 'BlankNode';

BlankNode.nextId = 0;

module.exports = BlankNode;

},{}],3:[function(require,module,exports){

'use strict';

const Quad = require('./quad');
const Literal = require('./literal');
const Variable = require('./variable');
const BlankNode = require('./blank-node');
const NamedNode = require('./named-node');
const DefaultGraph = require('./default-graph');

class DataFactory {

  constructor(prefixMap) {
    this.prefixes = {};
    if (prefixMap) this.addPrefixes(prefixMap);
    this.defaultGraphInstance = new DefaultGraph();
  }

  /* eslint class-methods-use-this: "off" */
  namedNode(value) {
    return new NamedNode(value);
  }

  /* eslint class-methods-use-this: "off" */
  blankNode(value) {
    return new BlankNode(value);
  }

  literal(value, languageOrDatatype) {
    if (typeof languageOrDatatype === 'string') {
      return (languageOrDatatype.indexOf(':') === -1)
        ? new Literal(value, languageOrDatatype)
        : new Literal(value, null, this.namedNode(languageOrDatatype));
    }
    return new Literal(value, null, languageOrDatatype);
  }

  /* eslint class-methods-use-this: "off" */
  variable(value) {
    return new Variable(value);
  }

  defaultGraph() {
    return this.defaultGraphInstance;
  }

  triple(subject, predicate, object) {
    return this.quad(subject, predicate, object, this.defaultGraph());
  }

  quad(subject, predicate, object, graph) {
    return new Quad(subject, predicate, object, graph || this.defaultGraph());
  }

  expand(value) {
    const index = value.indexOf(':');
    if (index > 0) {
      const namespace = this.prefixes[value.slice(0, index)];
      if (namespace) value = namespace + value.slice(index + 1);
    }
    return value;
  }

  addPrefix(prefix, namespace) {
    this.prefixes[prefix] = namespace;
    return this;
  }

  removePrefix(prefix) {
    delete this.prefixes[prefix];
    return this;
  }

  addPrefixes(prefixMap) {
    const prefixes = Object.keys(prefixMap);
    for (let p = 0, prefix; p < prefixes.length; p += 1) {
      prefix = prefixes[p];
      this.addPrefix(prefix, prefixMap[prefix]);
    }
    return this;
  }

  removePrefixes(prefixMapOrArr) {
    const arr = Array.isArray(prefixMapOrArr) ? prefixMapOrArr : Object.keys(prefixMapOrArr);
    for (let a = 0; a < arr.length; a += 1) {
      this.removePrefix(arr[a]);
    }
    return this;
  }

}

module.exports = DataFactory;

},{"./blank-node":2,"./default-graph":4,"./literal":5,"./named-node":6,"./quad":7,"./variable":8}],4:[function(require,module,exports){

'use strict';

class DefaultGraph {

  constructor() {
    this.value = '';
  }

  equals(other) {
    return other.termType === this.termType && other.value === this.value;
  }

}

DefaultGraph.prototype.termType = 'DefaultGraph';

module.exports = DefaultGraph;

},{}],5:[function(require,module,exports){
'use strict';

const NamedNode = require('./named-node');

class Literal {

  constructor(value, language, datatype) {
    this.value = value;

    if (language) {
      this.language = language;
      this.datatype = Literal.langStringDatatype;
    } else if (datatype) {
      this.datatype = datatype;
    }
  }

  equals(other) {
    return other.termType === this.termType
      && other.value === this.value
      && other.language === this.language
      && other.datatype.equals(this.datatype);
  }

}

Literal.prototype.termType = 'Literal';
Literal.prototype.language = '';
Literal.prototype.datatype = new NamedNode('http://www.w3.org/2001/XMLSchema#string');

Literal.langStringDatatype = new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');

module.exports = Literal;

},{"./named-node":6}],6:[function(require,module,exports){
'use strict';

class NamedNode {

  constructor(iri) {
    this.value = iri;
  }

  equals(other) {
    return other.termType === this.termType && other.value === this.value;
  }

}

NamedNode.prototype.termType = 'NamedNode';

module.exports = NamedNode;

},{}],7:[function(require,module,exports){
'use strict';

const DefaultGraph = require('./default-graph');

class Quad {

  constructor(subject, predicate, object, graph) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    if (graph) this.graph = graph;
  }

  equals(other) {
    return other.subject.equals(this.subject)
      && other.predicate.equals(this.predicate)
      && other.object.equals(this.object)
      && other.graph.equals(this.graph);
  }

}

Quad.prototype.grap = new DefaultGraph();

module.exports = Quad;

},{"./default-graph":4}],8:[function(require,module,exports){

'use strict';

class Variable {

  constructor(name) {
    this.value = name;
  }

  equals(other) {
    return other.termType === this.termType && other.value === this.value;
  }

}

Variable.prototype.termType = 'Variable';

module.exports = Variable;

},{}]},{},[1])(1)
});