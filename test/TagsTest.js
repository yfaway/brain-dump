var assert = require('chai').assert;
//var assert = require('assert');
var Tags = require('../Tags.js');

describe('Tags', function() {
  var tm;

  beforeEach(function() {
    tm = new Tags();
  });

  it('ctor, no param, sets to empty array', function() {
    assert.equal(0, tm.getTagCount());
  })

  it('ctor, empty array, sets to empty array', function() {
    tm = new Tags([]);
    assert.equal(0, tm.getTagCount());
  })

  it('ctor, wrong param type, throws exception', function() {
    var fcn = function() { new Tags({}) };
    assert.throws(fcn, "Expect an array of tag objects");
  })

  it('addTag, name not specified, throws exception', function() {
    var fcn = function() { tm.addTag(); };
    assert.throws(fcn, "Expect string tag name");
  })

  it('addTag, wrong type, throws exception', function() {
    var fcn = function() { tm.addTag(); };
    assert.throws(fcn, "Expect string tag name");
  })

  it('addTag, empty name, throws exception', function() {
    var fcn = function() { tm.addTag(''); };
    assert.throws(fcn, "Expect non-empty tag name");
  })

  it('addTag, one entry, returns tag object', function() {
    var name = 'politic';
    var tag = tm.addTag(name);
    assert.equal(name, tag.name);
    assert.equal(1, tag.count);
    assert.isDefined(tag.updatedTime);

    assert.equal(1, tm.getTagCount());
  })

  it('addTag, two entries, ref count value sets correctly', function() {
    var name = 'politic';
    tm.addTag(name);

    var tag = tm.addTag(name);
    assert.equal(name, tag.name);
    assert.equal(2, tag.count);
    assert.isDefined(tag.updatedTime);

    assert.equal(1, tm.getTagCount());
  })

  it('removeTag, no tags, returns false', function() {
    var name = 'politic';
    assert.isFalse(tm.removeTag(name));
  });

  it('removeTag, count = 1, removes tag and returns true', function() {
    var name = 'politic';
    tm.addTag(name);

    assert.isTrue(tm.removeTag(name));
    assert.equal(0, tm.getTagCount());
  });

  it('removeTag, count = 2, keeps tag and returns true', function() {
    var name = 'politic';
    tm.addTag(name);
    tm.addTag(name);

    assert.isTrue(tm.removeTag(name));
    assert.equal(1, tm.getTagCount());
  });

  it('getTagsSortedByPopularity, 3 elements, sortsByReferenceCount', function() {
    var name1 = 'politic';
    var name2 = 'economic';
    var name3 = 'kids';
    tm.addTag(name1);

    tm.addTag(name2);
    tm.addTag(name2);
    tm.addTag(name2);

    tm.addTag(name3);
    tm.addTag(name3);

    var sortArray = tm.getTagsSortedByPopularity();
    assert.equal(3, sortArray.length);
    assert.equal(name2, sortArray[0].name);
    assert.equal(name3, sortArray[1].name);
    assert.equal(name1, sortArray[2].name);
  });

  it('getTagsSortedByMru, 3 elements, sortsByUpdateTime', function() {
    var name1 = 'politic';
    var name2 = 'economic';
    var name3 = 'kids';
    tm.addTag(name1);

    tm.addTag(name2);
    tm.addTag(name2);
    tm.addTag(name2);

    tm.addTag(name3);
    tm.addTag(name3);

    var sortArray = tm.getTagsSortedByMru();
    assert.equal(3, sortArray.length);

    // technically the order should be name3, 2 and then 1, but the code
    // is executed very quick so the updated times are all the same. Thus the
    // original order is retained.
    assert.equal(name1, sortArray[0].name);
    assert.equal(name2, sortArray[1].name);
    assert.equal(name3, sortArray[2].name);
  });
});


