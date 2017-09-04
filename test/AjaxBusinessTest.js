var assert = require('chai').assert;
var AjaxBusiness = require('../AjaxBusiness.js');
var TestConstants = require('./TestConstants.js');

describe('AjaxBusiness', function() {
  var ajax;

  beforeEach(function() {
    ajax = new AjaxBusiness();
  });

  it('getTagsSortedByPopularity, no param, returns non-null', function() {
    var tags = ajax.getTagsSortedByPopularity();
    assert.isNotNull(tags);
  });

  it('addEntry, valid params, returns non-null entry', function() {
    var entry = ajax.addEntry(TestConstants.CONTENT1, TestConstants.TAGS);
    assert.isNotNull(entry);
  });
});
