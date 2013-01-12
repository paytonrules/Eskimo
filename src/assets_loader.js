module.exports = function(configuration) {
  var objectsWithAsset,
      totalAssets,
      _ = require('underscore'),
      tagName = configuration.tagName,
      htmlTagName = configuration.htmlTagName,
      jquery = configuration.jquery || require('jquery'),
      loadEvent = configuration.loadEvent,
      loadingComplete = configuration.completeCallback,
      
      Assets = require('./assets'),
      assets = new Assets();
  
  function onAssetLoaded(object, asset) {
    var sortedAssets;
    object.asset = asset; // This needs to be killed
   
    // race condition?
    if (assets.size() === totalAssets && loadingComplete) {
      loadingComplete(assets);
    }
  }

  function loadAsset(objectName, object) {
    var AssetLoader = require('./asset_loader');

    AssetLoader({
      objectName: objectName,
      object: object, 
      tagName: tagName,
      htmlTagName: htmlTagName,
      loadEvent: loadEvent,
      jquery: jquery,
      assets: assets,
      onComplete: onAssetLoaded}).load();
  }

  function calculateTotalAssetsIn(level) {
    objectsWithAsset = [];
    
    for (var object in level) {
      if (level[object][tagName]) {
        objectsWithAsset.push(level[object]);
      }
    }
    objectsWithAsset = _.flatten(objectsWithAsset);
    totalAssets = objectsWithAsset.length;
  }

  this.getJQuery = function() {
    return jquery;
  };

  this.getHTMLTagName = function() {
    return htmlTagName;
  };

  this.getLoadEvent = function() {
    return loadEvent;
  };

  this.getTagName = function() {
    return tagName;
  };

  this.getCompleteCallback = function() {
    return loadingComplete;
  };

  this.load = function(level) {
    calculateTotalAssetsIn(level);

    if (totalAssets <= 0) {
      loadingComplete(new Assets());
    } else {
      for(var objectName in level) {
        if (level[objectName][tagName]) {
          loadAsset(objectName, level[objectName]);
        }
      }
    }
  };
};

