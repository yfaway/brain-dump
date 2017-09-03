var assert = require('chai').assert;
//var assert = require('assert');
var DataManager = require('../DataManager.js');

describe('DataManager', function() {
  var dm;

  beforeEach(function() {
    dm = new DataManager({});
  });

  it('ctor - correct params - inits correctly', function() {
    assert.equal(0, dm.getEntryCount());
  });

  it('addEntry - validParams - returns successfully', function() {
    var content = "testinz";
    var tags = ['test', 'nada'];
    var entry = dm.addEntry(content, tags);

    assert.equal(1, dm.getEntryCount());
    assert.equal(content, entry.content);
    assert.equal(tags, entry.tags);
    assert.exists(entry.creationTime);
    assert.notExists(entry.updateTime);

    assert.equal(2, dm.getTagManager().getTagCount());
  });

  it('addEntry - multiple calls - maintains unique list of tags sorted by MRU', 
      function() {
    var content = "testinz";
    var tagList1 = ['test', 'nada'];
    dm.addEntry(content, tagList1);

    var tagList2 = ['religion', 'politics', 'test'];
    dm.addEntry("entry #2", tagList2);

    assert.equal(2, dm.getEntryCount());
    assert.equal(4, dm.getTagManager().getTagCount());
  });

  it('findEntriesByTag - zero match  - returns empty array', function() {
    var content = "testinz";
    var tagList1 = ['test', 'nada'];
    dm.addEntry(content, tagList1);

    var result = dm.findEntriesByTag('invalid tag');
    assert.equal(0, result.length);
  });

  it('findEntriesByTag - has match  - returns non-empty array', function() {
    var content = "testinz";
    var tagList1 = ['test', 'nada'];
    dm.addEntry(content, tagList1);

    var tagList2 = ['religion', 'politics', 'test'];
    dm.addEntry("entry #2", tagList2);

    var result = dm.findEntriesByTag(tagList1[0]);
    assert.equal(2, result.length);

    result = dm.findEntriesByTag(tagList1[1]);
    assert.equal(1, result.length);
  });
});
