var Level = function(imageAssets, soundAssets, levelDefinition) {
  var Jukebox = require('./jukebox');

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

var GameSpec = function(assetDefinition, jquery, screen) {
  var imageAssets, 
      soundAssets,
      imagesComplete = false,
      soundsComplete = false,
      AssetLoader = require('./asset_loader'),
      ObjectPipeline = require('./object_pipeline/display_visible_objects'),
      Assets = require("./assets");

  function checkAssetsComplete(level, onComplete) {
    if (imagesComplete && soundsComplete) {
      onComplete( new Level(imageAssets, soundAssets, level) )
    }
  }

  function completeImageLoading(level, onComplete, objects) {
    imagesComplete = true;
    ObjectPipeline.displayVisibleObjects(screen, objects);
    checkAssetsComplete(level, onComplete);
  }

  function loadImageAssets(level, onComplete) {
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

module.exports = GameSpec;
