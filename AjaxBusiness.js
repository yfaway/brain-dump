
var DataManager;
if (typeof DriveApp == "undefined") {
  DataManager = require('./DataManager.js');
}

var FOLDER_NAME = "__brain_dump__";
var FILE_NAME = "brain-dump.json";

/**
 * The business layer that response to AJAX calls. In the GAS environment
 * AJAX calls are done through the google.script.run API.
 */

/**
 * Returns a list of tags sorted by popularity.
 * @return {Array.<{name: string, count: number, updatedDate: number}}
 */
function getTagsSortedByPopularity() {
  return getDataManager().getTagManager().getTagsSortedByPopularity();
}

/**
 * Adds a new entry. Parameters validation is deferred.
 * @param {string} content - the entry content
 * @param {Array.<string>} - the list of tags
 * @return {name: string, tags: Array.<string>}
 */
function addEntry(content, tags) {
  return getDataManager().addEntry(content, tags);
}

function getDataManager() {
  var dm = new DataManager();

  var content = "testinz";
  var tagList1 = ['math-scores', 'elementary-school', 'education'];
  dm.addEntry('Gabrielle Roy school performance for the 2015-2016 school years',
      tagList1);

  var tagList2 = ['crypto-currency', 'learning'];
  dm.addEntry("Read more on crypto currencies.", tagList2);

  return dm;
}

/**
 * Returns an array of the entries matching the given parameters..
 * @type {Array.<object>}
 */
function findEntriesByTag(tagName, offset, count) {
  return getDataManager().findEntriesByTag(tagName, offset, count);
}


function main() {
//  var folder = initFolder();
//  var file = getActiveFile(folder);
  
//  var data = readFromFile(file);
  var manager = new DataManager({}); 
  Logger.log(manager.getEntryCount());

  Logger.log("*** upl from local");
  
  //DriveApp.createFile('New Text File', 'Hello, world!');
  var entry = {
    'createdDate' : 2,
    'content': 'Hello world\nhttp://google.com',
    'tags': ['cpan', 'javascript', 'AI'],
  };
  //Logger.log(JSON.stringify(entry));
}

if (typeof DriveApp == "undefined") {
  module.exports = { 
    'getTagsSortedByPopularity': getTagsSortedByPopularity,
    'addEntry': addEntry,
  };
}
