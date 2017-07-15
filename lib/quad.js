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
