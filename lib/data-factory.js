
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
