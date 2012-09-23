describe("Assets", function() {
  var Assert = require('assert'),
      Assets = require("../src/assets");
   
  it("returns null for assets that don't exist", function() {
    var assets = new Assets();
    
    Assert.equal(0, assets.size());
  });

  it("returns assets that do exist, matching the jquery format", function() {
    var assets = new Assets();

    assets.add('key', {get: function(index) { return "bleh";}});

    Assert.equal("bleh", assets.get('key'));
  });

});
