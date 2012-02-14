module.exports = function(configuration) {
  var assetNames,
      totalAssets,
      numLoadedAssets,
      _ = require('underscore'),
      assets = configuration.assets,
      tagName = configuration.tagName,
      loadingComplete = configuration.completeCallback;
  
  function onAssetLoaded(asset) {
    var sortedAssets;
    numLoadedAssets++;
    if (numLoadedAssets === totalAssets && loadingComplete) {
      sortedAssets = _.collect(assetNames, function(assetName) {
        return assets.get(assetName);
      });

      loadingComplete(sortedAssets);
    }
  }

  function loadAsset(assetName, object) {
    assets.load(assetName, object[tagName]['src'], onAssetLoaded);
  }

  function calculateTotalAssetsIn(level) {
    assetNames = []
    numLoadedAssets = 0;
    
    for (var object in level) {
      if (level[object][tagName]) {
        assetNames.push(object);
      }
    }
    assetNames = _.flatten(assetNames);
    totalAssets = assetNames.length;
  } 

  this.load = function(level) {
    calculateTotalAssetsIn(level);

    for(var object in level) {
      if (level[object][tagName]) {
        loadAsset(object, level[object]);
      }
    }
  }
};

