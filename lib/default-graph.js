
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
