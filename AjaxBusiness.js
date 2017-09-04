
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
function AjaxBusiness(jsonData) {

  /**
   * Returns a list of tags sorted by popularity.
   * @return {Array.<{name: string, count: number, updatedDate: number}}
   */
  this.getTagsSortedByPopularity = function() {
    var dm = new DataManager();

    var content = "testinz";
    var tagList1 = ['test', 'nada'];
    dm.addEntry(content, tagList1);

    var tagList2 = ['religion', 'politics', 'test'];
    dm.addEntry("entry #2", tagList2);

    return dm.getTagManager().getTagsSortedByPopularity();
  }

  /**
   * Adds a new entry. Parameters validation is deferred.
   * @param {string} content - the entry content
   * @param {Array.<string>} - the list of tags
   * @return {name: string, tags: Array.<string>}
   */
  this.addEntry = function(content, tags) {
    var dm = new DataManager();
    return dm.addEntry(content, tags);
  }
};
 

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

function doGet() {

  var tm = new Tags();
  tm.addTag('testinz');
  tm.addTag('business');
  tm.addTag('politic');
  
  var t = HtmlService.createTemplateFromFile('index');
  t.data = tm.getTagsSortedByPopularity();
  t.data = tm.getTagsSortedByPopularity();
  
  var output = t.evaluate();
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');

  return output;
}

if (typeof DriveApp == "undefined") {
  module.exports = AjaxBusiness;
}
