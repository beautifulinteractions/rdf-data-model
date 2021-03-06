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
