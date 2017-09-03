var Tags = require('./Tags.js');

/**
 * Manages the main data structure.
 * @constructor
 * @param {object} jsonData - the backend data; can be {} for new data.
 */
function DataManager(jsonData) {
  var root = jsonData;
  
  if (typeof root.entries === 'undefined') {
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
   * Returns an array of the entries matching the given parameters..
   * @type {Array.<object>}
   */
  this.findEntriesByTag = function(tagName, offset, count) {
    var result = [];
    // GAS doesn''t support Array.filter
    root.entries.forEach(function(item) {
        for (var i = 0; i < item.tags.length; ++i) {
          if ( item.tags[i] == tagName ) {
            result.push(item);
            break;
          }
        }
    });

    return result;
  };
}

module.exports = DataManager;
