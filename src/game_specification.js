var Jukebox = require('./jukebox'),
    _ = require('underscore'),
    AssetLoader = require('./asset_loader'),
    GameSpecFactory;

Level = function(imageAssets, soundAssets, levelDefinition) {
  this.images = function() {
    return imageAssets;
  };

  this.getJukebox = function() {
    return Jukebox(soundAssets);
  };

  this.gameObject = function(objectName) {
    return levelDefinition[objectName]; 
  };

  this.addGameObject = function(objectName, object) {
    levelDefinition[objectName] = object;
  };
};

GameSpec = function(assetDefinition, jquery, screen) {
  var imageAssets, 
      soundAssets,
      imagesComplete = false,
      soundsComplete = false,
      Assets = require("./assets");

  function checkAssetsComplete(level, onComplete) {
    if (imagesComplete && soundsComplete) {
      onComplete( new Level(imageAssets, soundAssets, level) )
    }
  }

  // Why am I passing objects?  I don't use it
  function completeImageLoading(level, onComplete, objects) {
    imagesComplete = true;
    checkAssetsComplete(level, onComplete);
  }

  function loadImageAssets(level, onComplete) {
    imageAssets.clear();

    var imageAssetLoader = new AssetLoader({ assets: imageAssets, 
                                           tagName: 'image',
                                           completeCallback: _.bind(completeImageLoading, this, level, onComplete) });
    imageAssetLoader.load(level);
  }

  function completeSoundLoading(level, onComplete, objects) {
    soundsComplete = true;
    checkAssetsComplete(level, onComplete);
  }

  function loadSoundAssets(level, onComplete) {
    soundAssets.clear(); // Shouldn't need this when these become part of a level object

    var soundAssetLoader = new AssetLoader({ assets: soundAssets,
                                           tagName: 'sound',
                                           completeCallback: _.bind(completeSoundLoading, this, level, onComplete) });
    soundAssetLoader.load(level);
  }

  // Should make this a collection
  function addAssetsForLevel(level, onComplete) {
    loadImageAssets(level, onComplete);
    loadSoundAssets(level, onComplete);
  }

  // Load should return nothing - onComplete should get passed the new level
  // AssetDefinition belongs to the GameSpec
  this.load = function(levelName, onComplete) {
    imageAssets = new Assets({ jquery: jquery, tag: 'IMG', loadEvent: 'load' });
    soundAssets = new Assets({ jquery: jquery, tag: 'audio', loadEvent: 'canplaythrough' });
    imagesComplete = false;
    soundsComplete = false;

    if (assetDefinition[levelName]) {
      addAssetsForLevel(assetDefinition[levelName], onComplete);
    } else {
      onComplete(new Level(imageAssets, soundAssets, {}));
    }
  }
}

GameSpecFactory = (function() {

  function createGameSpec(assetDefinition, jquery, screen) {
    return new GameSpec(assetDefinition, jquery, screen);
  }

  return {
    createGameSpec: createGameSpec
  };
})();

module.exports = GameSpecFactory;
