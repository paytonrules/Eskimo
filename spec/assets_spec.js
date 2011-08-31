describe("Eskimo.Assets", function() {
  var assets, spiedJQuery, $;

  function prepareHTML5() {
    var dom = require('jsdom').jsdom(),
        define = require('../node_modules/jsdom/lib/jsdom/level2/html').define,
        window = dom.createWindow();

    $ = require("jquery").create(window);

    define("HTMLAudioElement", {
      tagName: 'AUDIO',
      attributes: [
        'src'
      ]
    });
  }

  beforeEach(function() {
    var Assets;
    prepareHTML5();

    spiedJQuery = (function () {
      var original = $;
      return function(selector, context) {
        spiedJQuery.returnedItem = original(selector, context);
        return spiedJQuery.returnedItem;
      };
    })();

    Assets = require("spec_helper").Eskimo.Assets;
    assets = new Assets({jquery: spiedJQuery, 
                         tag: 'img',
                         loadEvent: 'loadEvent'});

    this.addMatchers( {
      toHaveTagName: function(tag) {
        return this.actual.tagName === tag;
      }
    });
  });
  
  it("doesn't have an asset if it hasn't been loaded yet by the user", function() {
    expect(assets.get('key')).toBeNull();
  });

  it("doesn't get the asset if the image hasn't been loaded into the DOM", function() {
    assets.load('key', 'src');

    expect(assets.get('key')).toBeNull();
  });

  it("can get the asset after it's loadevent is triggered", function() {
    assets.load('key', 'src');
    spiedJQuery.returnedItem.trigger('loadEvent');

    var asset = assets.get('key');

    expect(asset).not.toBeNull();
  });

  it("sets up the asset with the passed in source", function() {
    assets.load('key', 'src');
    spiedJQuery.returnedItem.trigger('loadEvent');

    var asset = assets.get('key');

    expect(asset.src).toEqual('src');
  });

  it("gives the asset the tag passed into the constructor", function() {
    assets.load('key', 'src');
    spiedJQuery.returnedItem.trigger('loadEvent');

    var asset = assets.get('key');

    expect(asset).toHaveTagName('IMG');
  });

  it("raises an exception if there is already an asset with that key", function() {
    assets.load('key', 'src');

    expect(function() { 
      assets.load('key', 'error'); 
    } ).toThrow({name: "Eskimo.AssetAlreadyExists",
                 message:"Asset 'error' already exists"});
  });
});
