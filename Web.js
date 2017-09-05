/**
 * Handles HTTP get and post requests.
 */

function doGet() {
  var tm = new Tags();
  tm.addTag('testinz');
  tm.addTag('business');
  tm.addTag('politic');
  
  var t = HtmlService.createTemplateFromFile('index');
  t.data = tm.getTagsSortedByPopularity();
  t.data = tm.getTagsSortedByPopularity();
  
  var output = t.evaluate();
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');

  return output;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}
