
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
 * Returns a list of tags sorted by popularity.
 * @return {Array.<{name: string, count: number, updatedDate: number}}
 */
function getTagsSortedByPopularity() {
  return getStorage().getTagManager().getTagsSortedByPopularity();
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
 * @type {Array.<object>}
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

  /*
  Logger.log("*** upl from local");
  
  //DriveApp.createFile('New Text File', 'Hello, world!');
  var entry = {
    'createdDate' : 2,
    'content': 'Hello world\nhttp://google.com',
    'tags': ['cpan', 'javascript', 'AI'],
  };
  var content = "testinz";
  var tagList1 = ['math-scores', 'elementary-school', 'education'];
  storage.addEntry('Gabrielle Roy school performance for the 2015-2016 school years',
      tagList1);

  var tagList2 = ['crypto-currency', 'learning'];
  storage.addEntry("Read more on crypto currencies.", tagList2);


  //Logger.log(JSON.stringify(entry));
  //*/
}

if (isInNodeJs) {
  module.exports = { 
    'getTagsSortedByPopularity': getTagsSortedByPopularity,
    'addEntry': addEntry,
  };
}
