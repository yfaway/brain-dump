
var InMemoryStorage;
var Storage;
var isInNodeJs = ("undefined" == typeof DriveApp);
if (isInNodeJs) {
  InMemoryStorage = require('./InMemoryStorage.js');
  Storage = require('./Storage.js');
}

/**
 * The business layer that response to AJAX calls. In the GAS environment
 * AJAX calls are done through the google.script.run API.
 */

/**
 * Returns a list of tags sorted by popularity. If the storage has at least
 * one entry, the returned tag list always has the first tag with the name 
 * 'All' and the count being the number of entries in storage.
 *
 * @param storage {Storage} - used by test code to passed-in an existing
 *     storage instance. For non-test code, a new {@link Storage} object is
 *     always constructed.
 *
 * @return {Array.<{name: string, count: number, updatedDate: number}}
 */
function getTagsSortedByPopularity(storage) {
  if (! isInNodeJs || 'undefined' == typeof storage) {
    storage = getStorage();
  }

  var tags = storage.getTagManager().getTagsSortedByPopularity();

  if ( 0 < storage.getEntryCount() ) {
    var firstTag = {name: 'All', count: storage.getEntryCount()};
    tags.unshift(firstTag);
  }

  return tags;
}

/**
 * Adds a new entry. Parameters validation is deferred.
 * @param {string} content - the entry content
 * @param {Array.<string>} - the list of tags
 * @return {name: string, tags: Array.<string>}
 */
function addEntry(content, tags) {
  return getStorage().addEntry(content, tags);
}

function getStorage() {
  var storage = new Storage();

  if (isInNodeJs) {
    storage.setImplementation(new InMemoryStorage());
  }
  else {
    var googleDriveStorage = new GoogleDriveStorage();
    googleDriveStorage.initalize();
    storage.setImplementation(googleDriveStorage);
  }

  return storage;
}

/**
 * Returns an array of the entries matching the given parameters..
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
function findEntriesByTag(tagName, offset, count) {
  return getStorage().findEntriesByTag(tagName, offset, count);
}

function main() {
  var googleDriveStorage = new GoogleDriveStorage();
  googleDriveStorage.initalize();

  var storage = new Storage();
  storage.setImplementation(googleDriveStorage);

  var tagList2 = ['crypto-currency', 'learning'];
  storage.addEntry("Read more on crypto currencies.", tagList2);

  Logger.log(storage.getEntryCount());
}

if (isInNodeJs) {
  module.exports = { 
    'getTagsSortedByPopularity': getTagsSortedByPopularity,
    'addEntry': addEntry,
  };
}
