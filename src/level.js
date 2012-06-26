var Jukebox = require('./jukebox'),
    _ = require('underscore'),
    AssetLoader = require('./asset_loader'),
    Level;


Level = (function() {
  var imageAssets, 
      soundAssets,
      currentLevel,
      imageLoaderCallbacks = [],
      Assets = require("./assets");

  function initializeAssets(jquery) {
    imageAssets = new Assets({jquery: jquery, tag: 'IMG', loadEvent: 'load'});
    soundAssets = new Assets({jquery: jquery, tag: 'audio', loadEvent: 'canplaythrough'});
  }

  function addImageLoaderCallback(callback) {
    imageLoaderCallbacks.push(callback);
  }

  function runImageLoaderCallbacks(objects) {
    _.each(imageLoaderCallbacks, function(callback) {
      callback(objects);
    });
  }

  function loadImageAssets() {
    imageAssets.clear();

    var imageAssetLoader = new AssetLoader({assets: imageAssets, 
                                            tagName: 'image',
                                            completeCallback: runImageLoaderCallbacks});
    imageAssetLoader.load(currentLevel);
  }

  function loadSoundAssets() {
    soundAssets.clear();

    var soundAssetLoader = new AssetLoader({assets: soundAssets,
                                            tagName: 'sound'});
    soundAssetLoader.load(currentLevel);
  }

  function addAssetsForCurrentLevel() {
    loadImageAssets();
    loadSoundAssets();
  }

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
    },
    
    addImageLoaderCallback: function(callback) {
      addImageLoaderCallback(callback);
    },

    runImageLoaderCallbacks: runImageLoaderCallbacks

  };
})();

module.exports = Level;
