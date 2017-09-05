var assert = require('chai').assert;
var AjaxBusiness = require('../AjaxBusiness.js');
var TestConstants = require('./TestConstants.js');

describe('AjaxBusiness', function() {
  beforeEach(function() {
  });

  it('getTagsSortedByPopularity, no param, returns non-null', function() {
    var tags = AjaxBusiness.getTagsSortedByPopularity();
    assert.isNotNull(tags);
  });

  it('addEntry, valid params, returns non-null entry', function() {
    var entry = AjaxBusiness.addEntry(TestConstants.CONTENT1, TestConstants.TAGS);
    assert.isNotNull(entry);
  });
});
