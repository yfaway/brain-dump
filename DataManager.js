function DataManager(jsonData) {
  var root = jsonData;
  
  if (typeof root.entries === 'undefined') {
    root.entries = [];
  }
  
  this.getEntryCount = function() {
    return root.entries.length;
  }
  
  this.addEntry = function(content, tags) {
    var entry = { 
      content: content,
      tags: tags,
      creationDate: new Date().getTime(),
    };
                 
    root.entries.push(entry);
  }
}
