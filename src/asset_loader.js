module.exports = function(configuration) {
  var objectsWithAsset,
      totalAssets,
      numLoadedAssets,
      _ = require('underscore'),
      assets = configuration.assets,
      tagName = configuration.tagName,
      htmlTagName = configuration.htmlTagName,
      jquery = configuration.jquery,
      loadEvent = configuration.loadEvent,
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
    var element = jquery("<" + htmlTagName + " src='" + object[tagName]['src'] + "'>");
    element.bind(loadEvent, function() {
      assets.add(objectName, element);
      onAssetLoaded(object, assets.get(objectName));
    });
  }

  function calculateTotalAssetsIn(level) {
    objectsWithAsset = [];
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

    if (totalAssets <= 0) {
      loadingComplete({});
    } else {
      for(var objectName in level) {
        if (level[objectName][tagName]) {
          loadAsset(objectName, level[objectName]);
        }
      }
    }
  };
};

