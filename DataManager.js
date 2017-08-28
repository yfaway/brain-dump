/**
 * Manages the main data structure.
 * @constructor
 * @param {object} jsonData - the backend data; can be {} for new data.
 */
function DataManager(jsonData) {
  var root = jsonData;
  
  if (typeof root.entries === 'undefined') {
    root.entries = [];
    root.tags = [];
  }
  
  /**
   * @return {int} the number of entries
   */
  this.getEntryCount = function() {
    return root.entries.length;
  }

  /**
   * @return {array} of tags sorted by most recently used
   */
  this.getTags = function() {
    return root.tags;
  };
  
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
      var idx = root.tags.indexOf(item);
      if ( idx != -1 ) {
        var firstElem = root.tags[0];
        root.tags[0] = item;
        root.tags[idx] = firstElem;
      }
      else {
        root.tags.push(item);
      }
    });

    return entry;
  }
}

module.exports = DataManager;
