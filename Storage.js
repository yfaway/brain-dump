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
   * Updates an existing entry.
   * @param entry {object}
   * @throw error if the entry is not valid.
   */
  this.updateEntry = function(entry) {
    return impl.updateEntry(entry);
  }

  /**
   * Searches the entries by the given tagName, and retrieves {@code count}
   * results from the {@code offset}.
   * @param tagName {string}
   * @param offset {int} the start index
   * @param count {int} the maximum number of items to retrieve
   * @return 
   *   { searchType: string,
   *     searchValue: string,
   *     hasMore: boolean,
   *     offset: int,
   *     count: int,
   *     entries: Array.<{content: string, 
   *                      tags: Array.<string>,
   *                      updatedDate: number}
   *   }
   */
  this.findEntriesByTag = function(tagName, offset, count) {
    var entries = impl.findEntriesByTagImpl(tagName, offset, count + 1);
    var result = {
      searchType: 'tag', 
      searchValue: tagName,
      offset: offset,
      count: count,
      hasMore: (entries.length > count),
      entries: entries,
    };

    if (result.hasMore) {
      entries.pop();
    }

    return result;
  };
}

if (typeof DriveApp == "undefined") {
  module.exports = Storage;
}
