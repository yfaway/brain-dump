var assert = require('chai').assert;
var AjaxBusiness = require('../AjaxBusiness.js');
var Storage = require('../Storage.js');
var InMemoryStorage = require('../InMemoryStorage.js');
var TestConstants = require('./TestConstants.js');

describe('AjaxBusiness', function() {
  beforeEach(function() {
  });

  it('getTagsSortedByPopularity, no entries, returns non-null', function() {
    var tags = AjaxBusiness.getTagsSortedByPopularity();
    assert.isNotNull(tags);
    assert.equal(0, tags.length);
  });

  it('getTagsSortedByPopularity, one entry, returns tags array with All tag', 
      function() {

    var storage = new Storage();
    storage.setImplementation(new InMemoryStorage());

    var entry = storage.addEntry(
        TestConstants.CONTENT1, TestConstants.TAGS);

    var tags = AjaxBusiness.getTagsSortedByPopularity(storage);
    assert.isNotNull(tags);
    assert.equal(TestConstants.TAGS.length + 1, tags.length);
    assert.equal('All', tags[0].name);
    assert.equal(1, tags[0].count);
  });

  it('addEntry, valid params, returns non-null entry', function() {
    var entry = AjaxBusiness.addEntry(
        TestConstants.CONTENT1, TestConstants.TAGS);
    assert.isNotNull(entry);
  });
});
