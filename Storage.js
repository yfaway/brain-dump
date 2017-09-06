/**
 * The main interface to the data.
 * Usage: 
 * var storage = new Storage();
 * storage.setImplementation(...);
 * storage.addEntry(...);
 *
 * @constructor
 */
function Storage() {
  var impl;

  /**
   * Sets the backed implementation for this class. Any call to {@link Storage}
   * methods will be redirected to the provided implementation.
   */
  this.setImplementation = function(implementation) {
    impl = implementation;
  }

  /**
   * @return {int} the number of entries
   */
  this.getEntryCount = function() {
    return impl.getEntryCount();
  }

	/**
   * @return {Tags}
   */
	this.getTagManager = function() {
		return impl.getTagManager();
	}
  
  /**
   * Adds a new entry.
   * @param {string} content
   * @param {array} tags - array of strings
   * @return {object}
   */
  this.addEntry = function(content, tags) {
    return impl.addEntry(content, tags);
  }

  /**
   * Returns an array of the entries matching the given parameters..
   * @type {Array.<object>}
   */
  this.findEntriesByTag = function(tagName, offset, count) {
    return impl.findEntriesByTag(tagName, offset, count);
  };
}

if (typeof DriveApp == "undefined") {
  module.exports = Storage;
}
