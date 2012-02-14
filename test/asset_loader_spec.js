describe("AssetsLoader", function() {
  var AssetsLoader = require('../src/asset_loader'),
      Assets = require('../src/assets'),
      MockAssets = require('./mock_assets.js'),
      sandbox = require('sinon').sandbox.create(),
      assets;

  beforeEach(function() {
    assets = new MockAssets();
  });

  afterEach(function() {
    sandbox.restore();
  })

  it("creates an asset for the matching tag, with the object's name", function() {
    var gameObject = {
      "gameObject" : {
        "image" : {
          "src" : "background.jpg"
        }
      }
    };

    var assetLoader = new AssetsLoader({assets: assets, tagName: 'image'});
    
    assetLoader.load(gameObject);

    assets.get("gameObject").should.equal('background.jpg');
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

    var assetLoader = new AssetsLoader({assets: assets, tagName: 'image'});
    
    assetLoader.load(level);

    assets.get("gameObject_1").should.equal("background.jpg");
    assets.get("gameObject_2").should.equal("alsoBackground.jpg");
  });

  it("makes the finished callback with the assets in the order they are specified in the level, not the order of the asset loading", function () {
    var completeCallback = function(assets) {
      completeCallback.assets = assets.slice();
    };
    
    var loader = new AssetsLoader({assets: assets,
                                   tagName: 'test',
                                   completeCallback: completeCallback});

    loader.load({'object_one' : {
                  'test' : { 'src' : 'oneAsset' }
                },
                'object_two' : {
                  'test' : {'src' : 'twoAsset'}
                }}
               );

    assets.makeCallbackFor('object_two', 'twoAsset');
    assets.makeCallbackFor('object_one', 'oneAsset');

    completeCallback.assets.length.should.equal(2);
    completeCallback.assets[0].should.equal('oneAsset');
    completeCallback.assets[1].should.equal('twoAsset');
  });

  it("doesnt make the callback if the assets are never loaded", function() {
    var completeCallback = function(assets) {
      completeCallback.assets = assets.slice();
    };
    completeCallback.assets = [];
    
    var loader = new AssetsLoader({assets: assets,
                                   tagName: 'test',
                                   completeCallback: completeCallback});

    loader.load({'object_one' : {
                  'test' : { 'src' : 'oneAsset' }
                },
                'object_two' : {
                  'test' : {'src' : 'twoAsset'}
                }}
               );

    assets.makeCallbackFor('object_one', 'oneAsset');

    completeCallback.assets.length.should.equal(0);
  });

  it("doesn't wait for assets that aren't there to make the callback", function() {
    var completeCallback = sandbox.stub();
    var loader = new AssetsLoader({assets: assets,
                                   tagName: 'test',
                                   completeCallback: completeCallback});

    loader.load({'object_one' : {},
                'object_two' : {
                  'test' : { 'src' : 'oneAsset'}
                }});
    
    assets.makeCallbackFor('object_two', 'bleh');

    completeCallback.called.should.be.true;
  });
 
});
