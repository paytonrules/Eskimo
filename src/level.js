var Jukebox = require('./jukebox'),
    _ = require('underscore'),
    Level;

AssetLoader = function(configuration) {
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

Level = (function() {
  var imageAssets, 
      soundAssets,
      currentLevel,
      Assets = require("./assets");

  function initializeAssets(jquery) {
    imageAssets = new Assets({jquery: jquery, tag: 'IMG', loadEvent: 'load'});
    soundAssets = new Assets({jquery: jquery, tag: 'audio', loadEvent: 'canplaythrough'});
  };

  function loadImageAssets() {
    imageAssets.clear();

    var imageAssetLoader = new AssetLoader({assets: imageAssets, 
                                            tagName: 'images',
                                            completeCallback: Level.allImagesLoaded});
    imageAssetLoader.load(currentLevel);
  }

  function loadSoundAssets() {
    soundAssets.clear();

    var soundAssetLoader = new AssetLoader({assets: soundAssets,
                                            tagName: 'sounds'});
    soundAssetLoader.load(currentLevel);
  }

  function addAssetsForCurrentLevel() {
    loadImageAssets();
    loadSoundAssets();
  };

  return {
    getJukebox: function() {
      return Jukebox(soundAssets);
    },

    images: function() {
      return imageAssets;
    },

    load: function(levelName) {
      if (this.levels[levelName]) {
        currentLevel = this.levels[levelName];
        addAssetsForCurrentLevel();
      }
    },

    addImage: function(key, image) {
      imageAssets.add(key, image);
    },

    initializeAssets: function(jquery) {
      initializeAssets(jquery);
    },

    gameObject: function(objectName) {
      return currentLevel[objectName];
    },

    addGameObject: function(objectName, object) {
      currentLevel[objectName] = object;
    }

  };
})();

module.exports = Level;
