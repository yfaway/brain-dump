var Tags;
var IS_OUTSIDE_GAS = (typeof DriveApp == "undefined");

if (IS_OUTSIDE_GAS) {
  Tags = require('./Tags.js');
}

/**
 * Manages the main data structure.
 * @constructor
 * @param {object|string} jsonData - the backend data; can be undefined or {} 
 *     for new data.
 */
function InMemoryStorage(jsonData) {
  var root;

  if ('undefined' === typeof jsonData) {
    root = {};
  }
  else if ('string' === typeof jsonData) {
    if ( '' !== jsonData ) {
      var tmpStructure = JSON.parse(jsonData);
      root = { 
        entries: tmpStructure.entries,
        tags: new Tags(tmpStructure.tagsString),
      }
    }
    else {
      root = {};
    }
  }
  else if ('object' === typeof jsonData) {
    root = jsonData;
  }
  else {
    throw "Unexpected data type";
  }
  
  if ('undefined' === typeof root.entries) {
    root.entries = [];
    root.tags = new Tags();
  }
  
  /**
   * @return {int} the number of entries
   */
  this.getEntryCount = function() {
    return root.entries.length;
  }

	/**
   * @return {Tags}
   */
	this.getTagManager = function() {
		return root.tags;
	}
  
  /**
   * Adds a new entry.
   * @param {string} content
   * @param {array} tags - array of strings
   * @return {object} - a copy of the object in storage.
   */
  this.addEntry = function(content, tags) {
    if ( typeof content !== 'string' ) {
      throw "Expect string content";
    }

    if ( null == content || content.length == 0 ) {
      throw "Expect non-empty content";
    }

    this.validateTagArray(tags);

    var id;
    if (IS_OUTSIDE_GAS) {
      id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
    }
    else {
      id = Utilities.getUuid();
    }

    var entry = { 
      id: id,
      content: content,
      tags: tags.slice(),
      creationTime: new Date().getTime(),
    };
                 
    root.entries.push(entry);

    tags.forEach(function(item, index, array) {
      root.tags.addTag(item);
    });

    return this.copyEntry(entry);
  }

  /**
   * Updates an existing entry.
   * @param entry {object}
   * @throw error if the entry is not valid.
   */
  this.updateEntry = function(entry) {
    if ('undefined' === typeof entry || null === entry) {
      throw "Must be a non-null entry";
    }

    if ( ('string' !== typeof entry.id) || '' === entry.id ) {
      throw "Expect non-empty id string";
    }

    if ( ('string' !== typeof entry.content) || '' === entry.content ) {
      throw "Expect non-empty content string";
    }

    this.validateTagArray(entry.tags);

    var found = false;
    for ( var i = 0; i < root.entries.length; ++i ) {
      var existingItem = root.entries[i];

      if ( entry.id === existingItem.id ) {
        existingItem.content = entry.content;
        existingItem.modificationTime = new Date().getTime();

        // remove old tags
        existingItem.tags.forEach(function(item, index, array) {
          root.tags.removeTag(item);
        });
        
        // add new tags
        existingItem.tags = entry.tags.slice();
        existingItem.tags.forEach(function(item, index, array) {
          root.tags.addTag(item);
        });

        found = true;
        break;
      }
    };

    if ( false === found ) {
      throw "Entry not found";
    }
  }

  this.validateTagArray = function(tags) {
    if (! Array.isArray(tags) || tags.length == 0 ) {
      throw "Expect non-empty tags array";
    }

    tags.forEach(function(name) {
        if ( typeof name !== 'string'
            || '' == name ) {
        throw "Tags array must contain non-empty string names";
        }
    });
  }

  /**
   * Returns an array of the entries matching the given parameters. If tagName
   * is an empty string, returns all entries.
   * @type {Array.<object>} - the objects in the array are copies of the
   *   objects in storage.
   */
  this.findEntriesByTagImpl = function(tagName, offset, count) {
    var result = [];
    if ( 'All' == tagName ) {
      result = this.getAllEntries(offset, count);
    }
    else {
      // GAS doesn''t support Array.filter
      var storage = this;
      root.entries.forEach(function(item) {
          for (var i = 0; i < item.tags.length; ++i) {
            if ( item.tags[i] == tagName ) {
              result.push(storage.copyEntry(item));
              break;
            }
          }
      });

      // sort by creationTime DESC
      result.sort(function(a, b) {
        return b.creationTime - a.creationTime;
      });
    }

    return result;
  };

  /**
   * Returns the entries sorted by creationTime in descending order.
   * @type {Array.<object>} - the objects in the array are copies of the
   *   objects in storage.
   */
  this.getAllEntries = function(offset, count) {
    var entriesClone = root.entries.slice();

    // sort by creationTime DESC
    entriesClone.sort(function(a, b) {
      return b.creationTime - a.creationTime;
    });

    var result = [];
    var upperRange = Math.min(offset + count, entriesClone.length);
    if (offset < entriesClone.length ) {
      for (var i = offset; i < upperRange; ++i) {
          result.push(this.copyEntry(entriesClone[i]));
      }
    }

    return result;
  }

  /**
   * Returns a new deep-copy of the given entry.
   * @param entry {object}
   * @return {object} - copy of
   */
  this.copyEntry = function(entry) {
    var newEntry = {};
    newEntry.id = entry.id;
    newEntry.content = entry.content;
    newEntry.tags = entry.tags.slice();
    newEntry.creationTime = entry.creationTime;
    newEntry.modificationTime = entry.modificationTime;

    return newEntry;
  }

  /**
   * Transform the backed data into a JSON string.
   * @return {string}
   */
  this.toString = function() {
    var tmpStructure = {
      entries: root.entries,
      tagsString: root.tags.toString(),
    };

    return JSON.stringify(tmpStructure);
  };
}

if (IS_OUTSIDE_GAS) {
  module.exports = InMemoryStorage;
}
