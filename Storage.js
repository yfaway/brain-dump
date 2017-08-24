/**
 * Reads from {@code file} and returns the JSON parsed object.
 * @param file File
 * @return Object
 */
function readFromFile(file) {
  var blob = file.getBlob(); 
  var data = JSON.parse(blob.getDataAsString());
  
  return data;
}

/**
 * Checks if {@link FOLDER_NAME} exists; if not, create it at root level.
 * @return Folder
 */
function initFolder() {
  var brainDumpFolder = null;
  var folders = DriveApp.getFolders();
  while (folders.hasNext()) {
    var tmpFolder = folders.next();
    if (FOLDER_NAME == tmpFolder.getName()) {
      brainDumpFolder = tmpFolder;
      break;
    }
  }
  
  if ( null == brainDumpFolder ) {
    brainDumpFolder = DriveApp.createFolder(FOLDER_NAME);
  }
  
  return brainDumpFolder;
}

/**
 * Gets or creates file {@link FILE_NAME} in {@code folder}.
 * @return File
 */ 
function getActiveFile(folder) {
  var file;
  var fileIterator = folder.getFilesByName(FILE_NAME);
  if (fileIterator.hasNext()) {
    file = fileIterator.next();
  }
  else {
    file = folder.createFile(FILE_NAME, '{"key": "testing 1 2 3"}');
  }
  
  return file;
}