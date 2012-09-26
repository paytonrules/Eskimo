describe("AssetsLoader", function() {
  var AssetsLoader = require('../src/asset_loader'),
      Assert = require('assert'),
      Assets = require('../src/assets'),
      sandbox = require('sinon').sandbox.create(),
      window,
      jquerySpy;

  function prepareHTML5() {
    var dom = require('jsdom').jsdom(),
        define = require('../node_modules/jsdom/lib/jsdom/level2/html').define;
    window = dom.createWindow();

    require("jquery").create(window);
    jquerySpy = sandbox.spy(window, 'jQuery');
  }

  beforeEach(function() {
    prepareHTML5();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("defaults to real jquery", function() {
    var assetLoader = new AssetsLoader({});

    Assert.equal(require('jquery'), assetLoader.getJQuery());
  });
 
  it("loads one asset from the list", function(done) { 
    var level = {
      "gameObject" : {
        "image" : {
          "src" : "background.jpg"
        }
      }
    };

    var assetLoader = new AssetsLoader({ htmlTagName: 'IMG',
                                        tagName: 'image',
                                        jquery: jquerySpy,
                                        loadEvent: 'loadEvent',
                                        completeCallback: function(assets) {
                                          Assert.equal(1, assets.size())
                                          Assert.equal('background.jpg', 
                                                      assets.get('gameObject').src);
                                          Assert.equal('IMG', assets.get('gameObject').tagName);
                                          done();
                                        }});

    assetLoader.load(level);

    jquerySpy.returnValues[0].trigger('loadEvent');
  });

  // Make sure you're testing the right tag, 
  // using the right jquery event, creating the right 
  // object, handling all tags

  it("Attaches the object to the asset", function() {
    var gameObject = {
      "gameObject" : {
        "image" : {
          "src" : "background.jpg"
        }
      }
    };
    var assetLoader = new AssetsLoader({ htmlTagName: 'IMG',
                                        tagName: 'image',
                                        jquery: jquerySpy,
                                        loadEvent: 'loadEvent',
                                        completeCallback: function(assets) {
                                          Assert.equal(gameObject['gameObject'].asset,
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

    var assetLoader = new AssetsLoader({htmlTagName: 'IMG',
                                        tagName: 'image',
                                        jquery: jquerySpy,
                                        loadEvent: 'loadEvent',
                                        completeCallback: function(assets) {
                                          Assert.equal("background.jpg",
                                              assets.get("gameObject_1").src);
                                          Assert.equal("alsoBackground.jpg",
                                              assets.get("gameObject_2").src);
                                          done();
                                        }});
    
    assetLoader.load(level);
  });

  it("doesn't wait for objects without assets to make the callback", function() {
    var completeCallback = sandbox.stub();
    var assetLoader = new AssetsLoader({htmlTagName: 'IMG',
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
    var completeCallback = function(assets) {
      completeCallback.assets = assets;
    };
    var loader = new AssetsLoader({tagName: 'test',
                                  completeCallback: completeCallback});

    loader.load({'object_one' : {} });

    Assert.equal(0, completeCallback.assets.size());
  });

});
