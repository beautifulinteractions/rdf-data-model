
'use strict';

const runTests = require('../node_modules/rdf-data-model/test/index');
const DataFactory = require('..').DataFactory;

const factory = new DataFactory();

runTests(factory);
