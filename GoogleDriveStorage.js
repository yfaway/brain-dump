
/**
 * Implements the {@link Storage} interface with data being saved to a Google
 * Drive file.
 */
function GoogleDriveStorage() {
  var FOLDER_NAME = "__brain_dump__";
  var FILE_NAME = "brain-dump.json";

  var inMemoryStorage;
  var file;

  /**
   * Loads the content of the file storage into the {@link InMemoryStorage}
   * object. The file will be created if it does not exist.
   */
  this.initalize = function() {
    var folder = this.initFolder();
    file = this.getActiveFile(folder);

    var blob = file.getBlob(); 
    inMemoryStorage = new InMemoryStorage(blob.getDataAsString());

    /*
    if ( 0 == inMemoryStorage.getEntryCount() ) {
      for (var i = 0; i < 1000; ++i) {
        var tagList2 = ['crypto-currency', 'learning'];
        inMemoryStorage.addEntry("Read more on crypto currencies " + i, tagList2);
      }
      file.setContent(inMemoryStorage.toString());
    }
    */
  }

  /**
   * @return {int} the number of entries
   */
  this.getEntryCount = function() {
    return inMemoryStorage.getEntryCount();
  }

	/**
   * @return {Tags}
   */
	this.getTagManager = function() {
		return inMemoryStorage.getTagManager();
	}
  
  /**
   * Adds a new entry and immediately write to the file.
   * @param {string} content
   * @param {array} tags - array of strings
   * @return {object}
   */
  this.addEntry = function(content, tags) {
    var entry = inMemoryStorage.addEntry(content, tags);
    file.setContent(inMemoryStorage.toString());
    return entry;
  }

  /**
   * Returns an array of the entries matching the given parameters..
   * @type {Array.<object>}
   */
  this.findEntriesByTag = function(tagName, offset, count) {
    return inMemoryStorage.findEntriesByTag(tagName, offset, count);
  };


  /**
   * Checks if {@link FOLDER_NAME} exists; if not, create it at root level.
   * @return {Folder}
   */
  this.initFolder = function() {
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
   * @return {File}
   */ 
  this.getActiveFile = function(folder) {
    var file;
    var fileIterator = folder.getFilesByName(FILE_NAME);
    if (fileIterator.hasNext()) {
      file = fileIterator.next();
    }
    else {
      file = folder.createFile(FILE_NAME, '');
    }
    
    return file;
  }
}
