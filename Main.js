var FOLDER_NAME = "__brain_dump__";
var FILE_NAME = "brain-dump.json";

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

function addNewContent(content) {
  Logger.log('I was called with: ' + content);
  return "hai - success";
}

function getTags() {
  console.log("h0");
  var dm = new DataManager({});
  Logger.log("h1");

  var content = "testinz";
  var tagList1 = ['test', 'nada'];
  dm.addEntry(content, tagList1);
  Logger.log("h2");

  var tagList2 = ['religion', 'politics', 'test'];
  dm.addEntry("entry #2", tagList2);
  Logger.log("h3");

  return dm.getTagManager().getTagsSortedByPopularity();
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

