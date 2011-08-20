describe("Game.Assets", function() {
  var assets, spiedJQuery;

  beforeEach(function() {
    $ = require("jquery");
    spiedJQuery = (function () {
      var original = $;
      return function(selector, context) {
        spiedJQuery.returnedItem = original(selector, context);
        return spiedJQuery.returnedItem;
      };
    })();

    var GameAssets = require("specHelper").Game.Assets;
    assets = new GameAssets(spiedJQuery);

    this.addMatchers( {
      toHaveTagName: function(tag) {
        return this.actual.tagName === tag;
      }
    });
  });
  
  it("doesn't have an asset if it hasn't been loaded yet by the user", function() {
    expect(assets.get('key')).toBeNull();
  });

  it("doesn't get the image if the image hasn't been loaded into the DOM", function() {
    assets.loadImage('key', 'src');

    expect(assets.get('key')).toBeNull();
  });

  it("can get the image after it is loaded into the dom", function() {
    assets.loadImage('key', 'src');
    spiedJQuery.returnedItem.load();

    var image = assets.get('key');

    expect(image).toHaveTagName('IMG');
  });

  it("sets up the image with the passed in source", function() {
    assets.loadImage('key', 'src');
    spiedJQuery.returnedItem.load();

    var image = assets.get('key');

    expect(image.src).toEqual('src');
  });

  it("raises an exception if there is already an asset with that key", function() {
    assets.loadImage('key', 'src');
    expect(function() { 
      assets.loadImage('key', 'error'); 
    } ).toThrow({name: "Game.AssetAlreadyExists",
                 message:"Asset 'error' already exists"});
  });
  
});
