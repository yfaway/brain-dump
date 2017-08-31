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

    assert.deepEqual(tags, dm.getTags());
  });

  it('addEntry - multiple calls - maintains unique list of tags sorted by MRU', 
      function() {
    var content = "testinz";
    var tagList1 = ['test', 'nada'];
    dm.addEntry(content, tagList1);

    var tagList2 = ['religion', 'politics', 'test'];
    dm.addEntry("entry #2", tagList2);

    assert.equal(2, dm.getEntryCount());
    assert.equal(4, dm.getTags().length);
    assert.equal('test', dm.getTags()[0]);
  });

});
