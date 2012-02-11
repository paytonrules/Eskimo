module.exports = function(configuration) {
  var totalAssets,
      loadedAssets,
      assets = configuration.assets,
      tagName = configuration.tagName,
      loadingComplete = configuration.completeCallback;
  
  function onAssetLoaded(asset) {
    loadedAssets.push(asset);
    if (loadedAssets.length === totalAssets && loadingComplete) {
      loadingComplete(loadedAssets);
    }
  }

  function loadAssets(object) {
    for (var assetName in object[tagName]) {
      assets.load(assetName, object[tagName][assetName]['src'], onAssetLoaded);
    }
  }

  function calculateTotalAssets(level) {
    var _ = require('underscore');

    totalAssets = 0;
    loadedAssets = [];
    for (var object in level) {
      if (level[object][tagName]) {
        totalAssets += _.keys(level[object][tagName]).length;
      }
    }
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

