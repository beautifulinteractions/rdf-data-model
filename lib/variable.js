
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
