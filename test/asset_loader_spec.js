describe("AssetsLoader", function() {
  var AssetsLoader = require('../src/asset_loader'),
      Assert = require('assert'),
      Assets = require('../src/assets'),
      MockAssets = require('./mock_assets.js'),
      sandbox = require('sinon').sandbox.create(),
      window,
      jquerySpy,
      assets;

  function prepareHTML5() {
    var dom = require('jsdom').jsdom(),
        define = require('../node_modules/jsdom/lib/jsdom/level2/html').define;
    window = dom.createWindow();

    require("jquery").create(window);

    define("HTMLAudioElement", {
      tagName: 'AUDIO',
      attributes: [
        'src'
      ]
    });

    jquerySpy = sandbox.spy(window, 'jQuery');
  }


  beforeEach(function() {
    assets = new MockAssets();
    prepareHTML5();
  });

  afterEach(function() {
    sandbox.restore();
  })
 
  it("loads one asset from the list", function(done) {
    var Assets = require('../src/assets');
    var realAssets = new Assets({jquery: jquerySpy,
                                 tag: 'img',
                                 loadEvent: 'loadEvent'});
    var level = {
      "gameObject" : {
        "image" : {
          "src" : "background.jpg"
        }
      }
    };
    
    var assetLoader = new AssetsLoader({assets: realAssets, 
                                        htmlTagName: 'IMG',
                                        tagName: 'image',
                                        jquery: jquerySpy,
                                        loadEvent: 'loadEvent',
                                        completeCallback: function(objectsWithAsset) {
                                          Assert.equal('background.jpg', 
                                                      objectsWithAsset[0]['image']['src']);
                                          Assert.ok(objectsWithAsset[0].asset);
                                          Assert.equal('IMG', objectsWithAsset[0].asset.tagName);
                                          done();
                                        }});

    assetLoader.load(level);

    jquerySpy.returnValues[0].trigger('loadEvent');
  });

  // Make sure you're testing the right tag, 
  // using the right jquery event, creating the right 
  // object, handling all tags
  // why send the "object" then do "object.asset" ? Do I ever use that?
  // Don't pass assets in

  it("creates an asset for the matching tag, with the object's name", function() {
    var gameObject = {
      "gameObject" : {
        "image" : {
          "src" : "background.jpg"
        }
      }
    };
    var Assets = require('../src/assets');
    var realAssets = new Assets({jquery: jquerySpy,
                                 tag: 'img',
                                 loadEvent: 'loadEvent'});

    var assetLoader = new AssetsLoader({assets: realAssets, 
                                        htmlTagName: 'IMG',
                                        tagName: 'image',
                                        jquery: jquerySpy,
                                        loadEvent: 'loadEvent',
                                        completeCallback: function(objectsWithAsset) {
                                          Assert.equal(objectsWithAsset[0].asset,
                                                       realAssets.get("gameObject"));
                                          done();
                                        }});
    assetLoader.load(gameObject);
  });

  it("creates multiple assets", function() {
    var level = {
      "gameObject_1" : {
        "image" : {
          "src" : "background.jpg"
        }
      },
      "gameObject_2" : {
        "image" : {
          "src" : "alsoBackground.jpg"
        }
      }
    };

    var Assets = require('../src/assets');
    var realAssets = new Assets({jquery: jquerySpy,
                                 tag: 'img',
                                 loadEvent: 'loadEvent'});

    var assetLoader = new AssetsLoader({assets: realAssets, 
                                        htmlTagName: 'IMG',
                                        tagName: 'image',
                                        jquery: jquerySpy,
                                        loadEvent: 'loadEvent',
                                        completeCallback: function(objectsWithAsset) {
                                          Assert.equal("background.jpg",
                                              realAssets.get("gameObject_1").src);
                                          Assert.equal("alsoBackground.jpg",
                                              realAssets.get("gameObject_2").src);
                                          done();
                                        }});
    
    assetLoader.load(level);
  });

  it("makes the finished callback with the objects in the order they are specified in the level, not the order of the asset loading", function () {
    var Assets = require('../src/assets');
    var realAssets = new Assets({jquery: jquerySpy,
                                 tag: 'img',
                                 loadEvent: 'loadEvent'});

    var assetLoader = new AssetsLoader({assets: realAssets, 
                                        htmlTagName: 'IMG',
                                        tagName: 'image',
                                        jquery: jquerySpy,
                                        loadEvent: 'loadEvent',
                                        completeCallback: function(objectsWithAsset) {
                                          Assert.equal('oneAsset', 
                                                       objectsWithAsset[0].asset.src);
                                          Assert.equal("twoAsset", 
                                                       objectsWithAsset[1].asset.src);
                                        }});
    var level = {
      'object_one' : {
        'image' : {'src' : 'oneAsset' }
      },
      'object_two' : {
        'image' : {'src' : 'twoAsset'}
      }
    };
    assetLoader.load(level);

    jquerySpy.returnValues[1].trigger('loadEvent');
    jquerySpy.returnValues[0].trigger('loadEvent');
  });

  it("doesn't wait for assets that aren't there to make the callback", function() {
    var completeCallback = sandbox.stub();
    var realAssets = new Assets({jquery: jquerySpy,
                                 tag: 'img',
                                 loadEvent: 'loadEvent'});
 
    var assetLoader = new AssetsLoader({assets: realAssets, 
                                        htmlTagName: 'IMG',
                                        tagName: 'image',
                                        jquery: jquerySpy,
                                        loadEvent: 'loadEvent',
                                  completeCallback: completeCallback});

    assetLoader.load({'object_one' : {},
                   'object_two' : {
                      'image' :  {'src' : 'oneAsset'}
                }});

    jquerySpy.returnValues[0].trigger('loadEvent');

    completeCallback.called.should.eql(true);
  });

  it("makes the callback immediately when there are no matching assets", function() {
    var completeCallback = sandbox.stub();
    var loader = new AssetsLoader({assets: assets,
                                  tagName: 'test',
                                  completeCallback: completeCallback});

    loader.load({'object_one' : {} });

    completeCallback.called.should.eql(true);
  });

});
