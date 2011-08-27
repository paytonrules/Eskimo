describe("Eskimo.Assets", function() {
  var assets, spiedJQuery;

  beforeEach(function() {
    var html5 = require('html5'),
        dom = require('jsdom').jsdom(null, null, {parser: html5}),
        define = require('../node_modules/jsdom/lib/jsdom/level2/html').define,
        window = dom.createWindow(),
        $ = require("jquery").create(window);

    define("HTMLAudioElement", {
      tagName: 'AUDIO',
      attributes: [
        'src'
      ]
    });

    spiedJQuery = (function () {
      var original = $;
      return function(selector, context) {
        spiedJQuery.returnedItem = original(selector, context);
        return spiedJQuery.returnedItem;
      };
    })();

    var Assets = require("spec_helper").Eskimo.Assets;
    assets = new Assets(spiedJQuery);

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
    } ).toThrow({name: "Eskimo.AssetAlreadyExists",
                 message:"Asset 'error' already exists"});
  });

  it("doesnt get a sound until its loaded into the DOM", function() {
    assets.loadSound('key', 'src');

    expect(assets.getSound('key')).toBeNull();
  });

  it("retrieves an audio element post DOM loading", function() {
    assets.loadSound('key', 'src');
    spiedJQuery.returnedItem.load();

    var audio = assets.getSound('key');

    expect(audio.src).toEqual('src');
  });

  it("creates audio elements");

  it("doesn't overwrite images with sounds or vice versa");

  
});
