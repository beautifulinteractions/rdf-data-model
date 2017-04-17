
'use strict'

var should = require('should')
var DataFactory = require('..').DataFactory

describe('prefixes', function () {
  it('should add a new prefix', function () {
    var factory = new DataFactory()
    var prefix = 'ex'
    var namespace = 'http://example.com/'
    factory.addPrefix(prefix, namespace)
    should(namespace).equal(factory._prefixes[prefix])
  })

  it('should delete a prefix', function () {
    var factory = new DataFactory()
    var prefix = 'ex'
    var namespace = 'http://example.com/'
    factory.addPrefix(prefix, namespace)
    should(namespace).equal(factory._prefixes[prefix])
    factory.delPrefix(prefix)
    should(undefined).equal(factory._prefixes[prefix])
  })

  it('should resolve a prefixed name when creating a NamedNode instance', function () {
    var factory = new DataFactory()
    var prefix = 'ex'
    var namespace = 'http://example.com/'
    var name = 'test'
    factory.addPrefix(prefix, namespace)
    var namedNode = factory.namedNode(`${prefix}:${name}`)
    should(namedNode.value).equal(`${namespace}${name}`)
  })

  it('should not resolve a prefixed name with an unknown prefix when creating a NamedNode instance', function () {
    var factory = new DataFactory()
    var prefix = 'ex'
    var namespace = 'http://example.com/'
    var name = 'test'
    var unknownPrefix = 'qq'
    factory.addPrefix(prefix, namespace)
    var namedNode = factory.namedNode(`${unknownPrefix}:${name}`)
    should(namedNode.value).equal(`${unknownPrefix}:${name}`)
  })

})
