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

  it("stores a reference to the asset on the game object", function() {
    var level = {
      "gameObject_1" : {
        "image" : {
          "src" : "background.jpg"
        }
      }
    };
 
    var assetLoader = new AssetsLoader({assets: assets, tagName: 'image'});
    assetLoader.load(level);
    assets.makeCallbackFor('gameObject_1', assets.get('gameObject_1'));

    level['gameObject_1'].asset.should.equal(assets.get('gameObject_1'));
  });

  it("makes a callback with all the loaded game objects", function () {
    var completeCallback = function(objects) {
      completeCallback.objects = objects.slice();
    };
    
    var loader = new AssetsLoader({assets: assets,
                                   tagName: 'test',
                                   completeCallback: completeCallback});
    var level = {
      'object_one' : {
        'test' : { 'src' : 'oneAsset' }
      },
      'object_two' : {
        'test' : {'src' : 'twoAsset'}
      }
    };
    loader.load(level);

    assets.makeCallbackFor('object_one', 'oneAsset');
    assets.makeCallbackFor('object_two', 'twoAsset');

    completeCallback.objects.length.should.equal(2);
    completeCallback.objects[0].should.equal(level['object_one']);
    completeCallback.objects[1].should.equal(level['object_two']);
  });

  it("makes the finished callback with the objects in the order they are specified in the level, not the order of the asset loading", function () {
    var completeCallback = function(assets) {
      completeCallback.assets = assets.slice();
    };
    
    var loader = new AssetsLoader({assets: assets,
                                   tagName: 'test',
                                   completeCallback: completeCallback});

    var level = {
      'object_one' : {
        'test' : { 'src' : 'oneAsset' }
      },
      'object_two' : {
        'test' : {'src' : 'twoAsset'}
      }
    };
    loader.load(level);

    assets.makeCallbackFor('object_two', 'twoAsset');
    assets.makeCallbackFor('object_one', 'oneAsset');

    completeCallback.assets.length.should.equal(2);
    completeCallback.assets[0].should.equal(level['object_one']);
    completeCallback.assets[1].should.equal(level['object_two']);
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
