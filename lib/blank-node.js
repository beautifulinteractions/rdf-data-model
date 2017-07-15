
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
