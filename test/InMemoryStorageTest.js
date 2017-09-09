var assert = require('chai').assert;
var InMemoryStorage = require('../InMemoryStorage.js');
var TestConstants = require('./TestConstants.js');

describe('InMemoryStorage', function() {
  var dm;

  beforeEach(function() {
    dm = new InMemoryStorage({});
  });

  it('ctor, no parameter, inits correctly', function() {
    dm = new InMemoryStorage();
    assert.equal(0, dm.getEntryCount());
  });

  it('ctor, empty object parameter, inits correctly', function() {
    dm = new InMemoryStorage({});
    assert.equal(0, dm.getEntryCount());
  });

  it('ctor, empty string, inits correctly', function() {
    dm = new InMemoryStorage('');
    assert.equal(0, dm.getEntryCount());
  });

  it('addEntry, wrong type, throws exception', function() {
    var fcn = function() { dm.addEntry(3); };
    assert.throws(fcn, "Expect string content");
  })

  it('addEntry, empty content, throws exception', function() {
    var fcn = function() { dm.addEntry(''); };
    assert.throws(fcn, "Expect non-empty content");
  })

  it('addEntry, wrong tags type, throws exception', function() {
    var fcn = function() { dm.addEntry('content', 3); };
    assert.throws(fcn, "Expect non-empty tags array");
  })

  it('addEntry, undefined tags type, throws exception', function() {
    var fcn = function() { dm.addEntry('content'); };
    assert.throws(fcn, "Expect non-empty tags array");
  })

  it('addEntry, empty tags array, throws exception', function() {
    var fcn = function() { dm.addEntry('content', []); };
    assert.throws(fcn, "Expect non-empty tags array");
  })

  it('addEntry, tags array contains null name, throws exception', function() {
    var fcn = function() { dm.addEntry('content', ['a', null]); };
    assert.throws(fcn, "Tags array must contain non-empty string names");
  })

  it('addEntry, tags array contains non-string value, throws exception', function() {
    var fcn = function() { dm.addEntry('content', ['a', 3]); };
    assert.throws(fcn, "Tags array must contain non-empty string names");
  })

  it('addEntry, tags array contains empty name, throws exception', function() {
    var fcn = function() { dm.addEntry('content', ['a', '', 'b']); };
    assert.throws(fcn, "Tags array must contain non-empty string names");
  })

  it('addEntry, validParams, returns successfully', function() {
    var tags = ['test', 'nada'];
    var entry = dm.addEntry(TestConstants.CONTENT1, tags);

    assert.equal(1, dm.getEntryCount());
    assert.equal(TestConstants.CONTENT1, entry.content);
    assert.equal(tags, entry.tags);
    assert.exists(entry.creationTime);
    assert.notExists(entry.updateTime);

    assert.equal(2, dm.getTagManager().getTagCount());
  });

  it('addEntry, multiple calls, maintains unique list of tags sorted by MRU', 
      function() {
    var tagList1 = ['test', 'nada'];
    dm.addEntry(TestConstants.CONTENT1, tagList1);

    var tagList2 = ['religion', 'politics', 'test'];
    dm.addEntry("entry #2", tagList2);

    assert.equal(2, dm.getEntryCount());
    assert.equal(4, dm.getTagManager().getTagCount());
  });

  it('findEntriesByTag, zero match , returns empty array', function() {
    var tagList1 = ['test', 'nada'];
    dm.addEntry(TestConstants.CONTENT1, tagList1);

    var result = dm.findEntriesByTag('invalid tag');
    assert.equal(0, result.length);
  });

  it('findEntriesByTag, has match , returns non-empty array', function() {
    var tagList1 = ['test', 'nada'];
    dm.addEntry(TestConstants.CONTENT1, tagList1);

    var tagList2 = ['religion', 'politics', 'test'];
    dm.addEntry(TestConstants.CONTENT2, tagList2);

    var result = dm.findEntriesByTag(tagList1[0]);
    assert.equal(2, result.length);

    result = dm.findEntriesByTag(tagList1[1]);
    assert.equal(1, result.length);
  });

  it('toString, no parameter, returns successfully', function() {
    var tagList1 = ['test', 'nada'];
    dm.addEntry(TestConstants.CONTENT1, tagList1);

    var tagList2 = ['religion', 'politics', 'test'];
    dm.addEntry(TestConstants.CONTENT2, tagList2);

    var strOutput = dm.toString();
    assert.equal('string', typeof strOutput);

    var rdm = new InMemoryStorage(strOutput);
    assert.equal(dm.getEntryCount(), rdm.getEntryCount());
    assert.equal(dm.getTagManager().getTagCount(),
        rdm.getTagManager().getTagCount());
  });

});
