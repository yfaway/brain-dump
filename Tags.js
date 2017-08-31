/**
 * Manages the list of tags. Each tag is associated with the reference count.
 * When the reference gets down to zero, the tag is removed from the array.
 * @constructor
 * @param {object} jsonData - the backend data; can be {} for new data.
 */
function Tags(jsonData) {
  /**
   * @type {Array.<{name: string, count: number, updatedDate: number}}
   */
  var tags;

  if (typeof jsonData === 'undefined') {
    tags = [];
  }
  else if (! Array.isArray(jsonData) ) {
    throw "Expect an array of tag objects";
  }
  else {
    tags = jsonData;
  }

  /**
   * @return {int} the number of tags.
   */
  this.getTagCount = function() { 
    return tags.length;
  }

  /**
   * Checks to see if a tag object with the given name already exists. If yes,
   * increment its refernce count by 1. If not, a new tag object with the
   * reference count of 1 is added.
   * @param {string} name - the name of the tag
   * @return {{name: string, count: number}} - a copy of the added/updated tag object
   */
  this.addTag = function(name) {
    if ( typeof name !== 'string' ) {
      throw "Expect string tag name";
    }

    if ( null == name || name.length == 0 ) {
      throw "Expect non-empty tag name";
    }

    var predicate = function(tag) {
      return tag.name === name;
    };

    var tag = tags.find(predicate);
    if ( null == tag ) {
      tag = {name: name, count: 1, updatedTime : new Date().getTime()};
      tags.push(tag);
    }
    else {
      tag.count++;
      tag.updatedTime = new Date().getTime();
    }

    var copyOfTag = {
      name: tag.name, 
      count: tag.count,
      updatedTime: tag.updatedTime }

    return copyOfTag;
  }

  /**
   * Removes the tag matching the given name. The reference count is 
   * decremented by one; if it reaches zero, the tag is removed.
   * @param {string} name - the name of the tag
   * @return {boolean} true to indicated if the tag did exist and was thus
   *     handled; false if the tag does not exist
   */
  this.removeTag = function(name) {
    var predicate = function(tag) {
      return tag.name === name;
    };

    var idx = tags.findIndex(predicate);
    if ( -1 != idx ) {
      var tag = tags[idx];
      tag.count--;
      if ( 0 == tag.count )  {
        tags.splice(idx, 1);
      }
    }

    return null != tag;
  }
}

module.exports = Tags;
