var Assert = require('assert');
describe("AssetLoaderFactory", function() {

  it("creates the asset loader with values from the lookup", function() {
    var callback = function() {};
    var factory = require("../src/asset_loader_factory");

    var loader = factory.create('jquery', 'image', callback);

    Assert.equal('jquery', loader.getJQuery());
    Assert.equal('IMG', loader.getHTMLTagName());
    Assert.equal('load', loader.getLoadEvent());
    Assert.equal('image', loader.getTagName());
    Assert.equal(callback, loader.getCompleteCallback());
  });

  it("respects other entries in the lookup", function() {
    var callback = function() {};
    var factory = require("../src/asset_loader_factory");

    var loader = factory.create('jquery', 'sound', callback);

    Assert.equal('audio', loader.getHTMLTagName());
    Assert.equal('canplaythrough', loader.getLoadEvent());
    Assert.equal('sound', loader.getTagName());
  });
});
