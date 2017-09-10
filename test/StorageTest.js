var assert = require('chai').assert;
var InMemoryStorage = require('../InMemoryStorage.js');
var Storage = require('../Storage.js');
var TestConstants = require('./TestConstants.js');

describe('StorageTest', function() {
  var storage;

  beforeEach(function() {
    storage = new Storage();
    storage.setImplementation(new InMemoryStorage({}));
  });

  it('findEntriesByTag, has match, returns correctly', function() {
    var tagList1 = ['test', 'nada'];
    storage.addEntry(TestConstants.CONTENT1, tagList1);
    var tagList2 = ['religion', 'politics', 'test'];
    storage.addEntry(TestConstants.CONTENT2, tagList2);

    var result = storage.findEntriesByTag(tagList1[0], 0, 1);
    assert.isNotNull(result);
    assert.isTrue(result.hasMore);
    assert.equal('tag', result.searchType);
    assert.equal(tagList1[0], result.searchValue);
    assert.equal(0, result.offset);
    assert.equal(1, result.count);
    assert.equal(1, result.entries.length);

    result = storage.findEntriesByTag(tagList1[0], 0, 2);
    assert.isFalse(result.hasMore);
    assert.equal(2, result.entries.length);
  });
});
