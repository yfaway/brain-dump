var Tags;

if (typeof DriveApp == "undefined") {
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
   * @return {object}
   */
  this.addEntry = function(content, tags) {
    if ( typeof content !== 'string' ) {
      throw "Expect string content";
    }

    if ( null == content || content.length == 0 ) {
      throw "Expect non-empty content";
    }

    if (! Array.isArray(tags) || tags.length == 0 ) {
      throw "Expect non-empty tags array";
    }

    tags.forEach(function(name) {
        if ( typeof name !== 'string'
            || '' == name ) {
        throw "Tags array must contain non-empty string names";
        }
    });

    var entry = { 
      content: content,
      tags: tags,
      creationTime: new Date().getTime(),
    };
                 
    root.entries.push(entry);

    tags.forEach(function(item, index, array) {
      root.tags.addTag(item);
    });

    return entry;
  }

  /**
   * Returns an array of the entries matching the given parameters. If tagName
   * is an empty string, returns all entries.
   * @type {Array.<object>}
   */
  this.findEntriesByTagImpl = function(tagName, offset, count) {
    var result = [];
    if ( 'All' == tagName ) {
      result = this.getAllEntries(offset, count);
    }
    else {
      // GAS doesn''t support Array.filter
      root.entries.forEach(function(item) {
          for (var i = 0; i < item.tags.length; ++i) {
            if ( item.tags[i] == tagName ) {
              result.push(item);
              break;
            }
          }
      });
    }

    return result;
  };

  this.getAllEntries = function(offset, count) {
    var result = [];

    if (offset < root.entries.length - 1) {
      for (var i = offset; i < Math.min(offset + count, root.entries.length);
            ++i) {
          result.push(root.entries[i]);
      }
    }

    return result;
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

if (typeof DriveApp == "undefined") {
  module.exports = InMemoryStorage;
}
