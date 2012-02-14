module.exports = function(configuration) {
  var objectsWithAsset,
      totalAssets,
      numLoadedAssets,
      _ = require('underscore'),
      assets = configuration.assets,
      tagName = configuration.tagName,
      loadingComplete = configuration.completeCallback;
  
  function onAssetLoaded(object, asset) {
    var sortedAssets;
    numLoadedAssets++;
    object.asset = asset;
    
    if (numLoadedAssets === totalAssets && loadingComplete) {
      loadingComplete(objectsWithAsset);
    }
  }

  function loadAsset(objectName, object) {
    assets.load(objectName, object[tagName]['src'], _.bind(onAssetLoaded, this, object));
  }

  function calculateTotalAssetsIn(level) {
    objectsWithAsset = []
    numLoadedAssets = 0;
    
    for (var object in level) {
      if (level[object][tagName]) {
        objectsWithAsset.push(level[object]);
      }
    }
    objectsWithAsset = _.flatten(objectsWithAsset);
    totalAssets = objectsWithAsset.length;
  } 

  this.load = function(level) {
    calculateTotalAssetsIn(level);

    for(var objectName in level) {
      if (level[objectName][tagName]) {
        loadAsset(objectName, level[objectName]);
      }
    }
  }
};

