var Jukebox = require('./jukebox'),
    _ = require('underscore'),
    AssetLoader = require('./asset_loader'),
    GameSpecFactory;

GameSpecFactory = (function() {
  var imageAssets, 
      soundAssets,
      currentLevel,
      imageLoaderCallbacks = [],
      imagesComplete = false,
      soundsComplete = false,
      allCompleteCallback,
      Assets = require("./assets");

  function initializeAssets(jquery) {
    imageAssets = new Assets({ jquery: jquery, tag: 'IMG', loadEvent: 'load' });
    soundAssets = new Assets({ jquery: jquery, tag: 'audio', loadEvent: 'canplaythrough' });
  }

  function addImageLoaderCallback(callback) {
    imageLoaderCallbacks.push(callback);
  }

  function runImageLoaderCallbacks(objects) {
    _.each(imageLoaderCallbacks, function(callback) {
      callback(objects);
    });
  }

  function checkAssetsComplete() {
    if (imagesComplete && soundsComplete && typeof(allCompleteCallback) !== "undefined") {
      allCompleteCallback();
    }
  }

  function completeImageLoading(objects) {
    imagesComplete = true;
    runImageLoaderCallbacks(objects);
    checkAssetsComplete();
  }

  function loadImageAssets() {
    imageAssets.clear();

    var imageAssetLoader = new AssetLoader({ assets: imageAssets, 
                                             tagName: 'image',
                                             completeCallback: completeImageLoading });
    imageAssetLoader.load(currentLevel);
  }

  function completeSoundLoading(objects) {
    soundsComplete = true;
    checkAssetsComplete();
  }

  function loadSoundAssets() {
    soundAssets.clear();

    var soundAssetLoader = new AssetLoader({ assets: soundAssets,
                                             tagName: 'sound',
                                             completeCallback: completeSoundLoading });
    soundAssetLoader.load(currentLevel);
  }

  function addAssetsForCurrentLevel() {
    loadImageAssets();
    loadSoundAssets();
  }
  

  function createGameSpec(assetDefinition, jquery, screen) {
    initializeAssets(jquery); 
    return (function() {
      function load(levelName, onComplete) {
        imagesComplete = false;
        soundsComplete = false;
        var levels = this.levels;
        if (levels[levelName]) {
          currentLevel = this.levels[levelName];
          allCompleteCallback = onComplete;
          addAssetsForCurrentLevel();
        }
        return this;
      }

      return {
        levels: assetDefinition, 
        getJukebox: function() {
          return Jukebox(soundAssets);
        },
        load: load, 
        gameObject: function(objectName) {
          return currentLevel[objectName];
        },
        addGameObject: function(objectName, object) {
          currentLevel[objectName] = object;
        },
        images: function() {
          return imageAssets;
        }
      };
    })();
  }

  return {

    initializeAssets: function(jquery) {
      initializeAssets(jquery);
    },

    addImageLoaderCallback: addImageLoaderCallback,
    runImageLoaderCallbacks: runImageLoaderCallbacks,
    createGameSpec: createGameSpec
  };
})();

module.exports = GameSpecFactory;
