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

function doGet() {
  var folder = initFolder();
  var file = getActiveFile(folder);
  
  var data = readFromFile(file);
  return ContentService.createTextOutput(data.key);
}
