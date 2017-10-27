
/**
 * Implements the {@link Storage} interface with data being saved to a Google
 * Drive file.
 */
function GoogleDriveStorage() {
  var FOLDER_NAME = "__brain_dump__";
  var FILE_NAME = "brain-dump.json";
  var CACHE_KEY_PREFIX = "raw-data";
  var CACHE_DURATION_IN_SECONDS = 60 * 30; // 30 minutes

  // GAS allows 100KB, but we just round it down
  var CACHE_MAX_VALUE_SIZE_IN_BYTES = 100000;

  var inMemoryStorage;
  var file;
  var cache = CacheService.getUserCache();

  /**
   * Loads the content of the file storage into the {@link InMemoryStorage}
   * object. The file will be created if it does not exist.
   */
  this.initalize = function() {
    var rawData = this.readRawDataFromCache(cache);

    if ( null == rawData ) {
      var folder = this.initFolder();
      file = this.getActiveFile(folder);

      var blob = file.getBlob(); 
      rawData = blob.getDataAsString();

      this.putRawDataToCache(cache, rawData);
    }

    inMemoryStorage = new InMemoryStorage(rawData);

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
   * Reads the raw data from {CacheService}. CacheService limits the value to
   * a specific size, thus, the raw data might be distributed in multiple keys.
   * @param cache {CacheService}
   * @return {string} null if data is not in cache
   */
  this.readRawDataFromCache = function(cache) {
    var rawData = "";
    var keyIndex = 0;
    while ( true ) {
      var key = this.getRawDataCacheKey(keyIndex);
      var value = cache.get(key);
      if ( null != value ) {
        rawData += value;
        keyIndex++;
      }
      else {
        break;
      }
    }

    return 0 == rawData.length ? null : rawData;
  }

  /**
   * Stores the input data in the {CacheService}. The data might be splitted
   * into mulitiple values if it is larger than the maximum value size 
   * permitted by {CacheService}.
   * @param cache {CacheService}
   * @param rawData {string}
   */
  this.putRawDataToCache = function(cache, rawData) {
    var keyIndex = 0;
    while ( true ) {
      var str = rawData.substr(keyIndex * CACHE_MAX_VALUE_SIZE_IN_BYTES,
          CACHE_MAX_VALUE_SIZE_IN_BYTES);
      if (0 == str.length) {
        break;
      }
      else {
        var key = this.getRawDataCacheKey(keyIndex);
        cache.put(key, str, CACHE_DURATION_IN_SECONDS);

        if ( str.length < CACHE_MAX_VALUE_SIZE_IN_BYTES ) {
          break;
        }
        else {
          keyIndex++;
        }
      }
    }
  }

  /**
   * Returns the cache key for the given key index.
   * @return {string}
   */
  this.getRawDataCacheKey = function(keyIndex) {
    return CACHE_KEY_PREFIX + "-" + keyIndex;
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
    this.writeRawDataToFile(cache, inMemoryStorage.toString());
    return entry;
  }

  /**
   * Writes the data to file and updates the cache.
   * @param cache {CacheService}
   * @param rawData {string}
   */
  this.writeRawDataToFile = function(cache, rawData) {
    if ( null == file ) {
      var folder = this.initFolder();
      file = this.getActiveFile(folder);
    }

    file.setContent(rawData);

    // invalidate cache
    if ( null != cache ) {
      var keyIndex = 0;
      while ( true ) {
        var key = CACHE_KEY_PREFIX + "-" + keyIndex;
        if (null == cache.get(key)) {
          break;
        }
        else {
          cache.remove(key);
          key++;
        }
      }
    }

    this.putRawDataToCache(cache, rawData);
  }

  /**
   * Returns an array of the entries matching the given parameters..
   * @type {Array.<object>}
   */
  this.findEntriesByTagImpl = function(tagName, offset, count) {
    return inMemoryStorage.findEntriesByTagImpl(tagName, offset, count);
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
