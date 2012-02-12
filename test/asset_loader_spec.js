describe("AssetsLoader", function() {
  var AssetsLoader = require('../src/asset_loader'),
      sandbox = require('sinon').sandbox.create(),
      Assets = require('../src/assets'),
      _ = require('underscore');

  afterEach(function() {
    sandbox.restore();
  });

  it("sends the assets in the order of the level, not the order of the asset loading", function () {
    var loadedAssets = {},
        assets = new Assets({});

    sandbox.stub(assets, 'load', function(name, src, callback) {
      loadedAssets[name] = {src: src, callback: callback};
    });
    sandbox.stub(assets, 'get', function(name) {
      return loadedAssets[name].src;
    });

    var completeCallback = function(assets) {
      completeCallback.assets = assets.slice();
    };
    
    var loader = new AssetsLoader({assets: assets,
                                   tagName: 'tests',
                                   completeCallback: completeCallback});

    loader.load({'object' : {
                  'tests' : { 
                    'one' : {'src' : 'oneAsset'},
                    'two' : {'src' : 'twoAsset'}
                  }
                 }
                });

    loadedAssets['two'].callback('twoAsset');
    loadedAssets['one'].callback('oneAsset');


    completeCallback.assets.length.should.equal(2);
    completeCallback.assets[0].should.equal('oneAsset');
    completeCallback.assets[1].should.equal('twoAsset');
  });

});
