
'use strict'

var should = require('should')
var DataFactory = require('..').DataFactory

describe('Prefixes', function () {

  it('.addPrefix() should add a new prefix', function () {
    var factory = new DataFactory()
    var prefix = 'ex'
    var namespace = 'http://example.com/'
    factory.addPrefix(prefix, namespace)
    should(namespace).equal(factory.prefixes[prefix])
  })

  it('.addPrefixes() should add new prefixes', function () {
    var factory = new DataFactory()
    var prefixMap = {};
    var prefix1 = 'ex1';
    var prefix2 = 'ex2';
    var namespace1 = 'http://example1.com';
    var namespace2 = 'http://example2.com';
    prefixMap[prefix1] = namespace1;
    prefixMap[prefix2] = namespace2;
    factory.addPrefixes(prefixMap);
    should(prefixMap).deepEqual(factory.prefixes)
  })

  it('.removePrefix() should remove a prefix', function () {
    var factory = new DataFactory()
    var prefixMap = {};
    var prefix1 = 'ex1';
    var prefix2 = 'ex2';
    var namespace1 = 'http://example1.com';
    var namespace2 = 'http://example2.com';
    prefixMap[prefix1] = namespace1;
    prefixMap[prefix2] = namespace2;
    factory.addPrefixes(prefixMap);
    should(prefixMap).deepEqual(factory.prefixes)
    delete prefixMap[prefix1];
    factory.removePrefix(prefix1);
    should(prefixMap).deepEqual(factory.prefixes);
  })

  it('.removePrefixes() should remove multiple prefixes', function () {
    var factory = new DataFactory()
    var prefixMap = {};
    var prefix1 = 'ex1';
    var prefix2 = 'ex2';
    var prefix3 = 'ex3';
    var namespace1 = 'http://example1.com';
    var namespace2 = 'http://example2.com';
    var namespace3 = 'http://example3.com';
    prefixMap[prefix1] = namespace1;
    prefixMap[prefix2] = namespace2;
    prefixMap[prefix3] = namespace3;
    factory.addPrefixes(prefixMap);
    should(prefixMap).deepEqual(factory.prefixes)
    delete prefixMap[prefix1];
    delete prefixMap[prefix2];
    factory.removePrefixes([prefix1, prefix2]);
    should(prefixMap).deepEqual(factory.prefixes);
  })

  it('should resolve a prefixed name when creating a NamedNode instance', function () {
    var factory = new DataFactory()
    var prefix = 'ex'
    var namespace = 'http://example.com/'
    var name = 'test'
    factory.addPrefix(prefix, namespace)
    var expanded = factory.expand(prefix + ':' + name)
    should(expanded).equal(namespace + name)
  })

})
