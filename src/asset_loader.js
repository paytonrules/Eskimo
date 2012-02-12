module.exports = function(configuration) {
  var assetNames,
      totalAssets,
      loadedAssets,
      _ = require('underscore'),
      assets = configuration.assets,
      tagName = configuration.tagName,
      loadingComplete = configuration.completeCallback;
  
  function onAssetLoaded(asset) {
    var sortedAssets;
    loadedAssets.push(asset);
    if (loadedAssets.length === totalAssets && loadingComplete) {
      sortedAssets = _.collect(assetNames, function(assetName) {
        return assets.get(assetName);
      });

      loadingComplete(sortedAssets);
    }
  }

  function loadAssets(object) {
    loadedAssets = [];
    for (var assetName in object[tagName]) {
      assets.load(assetName, object[tagName][assetName]['src'], onAssetLoaded);
    }
  }

  function calculateTotalAssets(level) {
    assetNames = []
    for (var object in level) {
      if (level[object][tagName]) {
        assetNames.push(_.keys(level[object][tagName]));
      }
    }
    assetNames = _.flatten(assetNames);
    totalAssets = assetNames.length;
  } 

  this.load = function(level) {
    calculateTotalAssets(level);
    for(var object in level) {
      if (level[object][tagName]) {
        loadAssets(level[object]);
      }
    }
  }
};

