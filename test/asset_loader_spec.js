describe("AssetsLoader", function() {
  var AssetsLoader = require('../src/asset_loader'),
      Assets = require('../src/assets'),
      MockAssets = require('./mock_assets.js'),
      assets;

  beforeEach(function() {
    assets = new MockAssets();
  });

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
/*  it("makes a configurable callback when all the images on a level are loaded", function() {
    level.levels = {
      "newLevel": {
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
      }
    };

    level.allImagesLoaded = sandbox.stub();

    level.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');

    level.allImagesLoaded.called.should.be.true;
  });

  it("makes that same call once if the images are spread over multiple objects", function() {
    level.levels = {
      "newLevel": {
        "gameObject" : {
          "images" : {
            "imageName" : {
              "src" : "background.jpg"
            }
          }
        },
        "gameObjectTwo" : {
          "images" : {
            "imageNameTwo" : {
              "src" : "alsoBackground.jpg"
            }
          }
        }
      }
    };

    var assetsAtCallTime;
    level.allImagesLoaded = function(assets) {
      assetsAtCallTime = assets.slice(0);
    }

    level.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');

    var orderedImageAssets = [level.images().get('imageName'),
                              level.images().get('imageNameTwo')];

    assetsAtCallTime.length.should.equal(2);
    assetsAtCallTime[0].should.equal(orderedImageAssets[0]);
    assetsAtCallTime[1].should.equal(orderedImageAssets[1]);
  });*/



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

});
