var Assert = require('assert');
describe("AssetLoaderFactory", function() {

  it("creates the asset loader with values from the lookup", function() {
    var callback = function() {};
    var factory = require("../src/asset_loader_factory");

    var loader = factory.create('image', callback);

    Assert.equal('IMG', loader.getHTMLTagName());
    Assert.equal('load', loader.getLoadEvent());
    Assert.equal('image', loader.getTagName());
    Assert.equal(callback, loader.getCompleteCallback());
  });

  it("respects other entries in the lookup", function() {
    var callback = function() {};
    var factory = require("../src/asset_loader_factory");

    var loader = factory.create('sound', callback);

    Assert.equal('audio', loader.getHTMLTagName());
    Assert.equal('canplaythrough', loader.getLoadEvent());
    Assert.equal('sound', loader.getTagName());
  });

  it("allows the sneaky insertion of jquery if need be", function() {
    var callback = function() {};
    var factory = require("../src/asset_loader_factory");

    var loader = factory.create('image', 'irrelelvant', 'jquery');

    Assert.equal('jquery', loader.getJQuery());
  });
});
