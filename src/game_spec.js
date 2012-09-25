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

var GameSpec = function(configuration) {
  var imageAssets, 
      soundAssets,
      imagesComplete = false,
      soundsComplete = false,
      Assets = require('./assets'),
      AssetLoader = require('./asset_loader'),
      ObjectPipeline = require('./object_pipeline/display_visible_objects'),
      _ = require('underscore'),
      jquery = configuration.jquery,
      assetDefinition = configuration.assetDefinition,
      screen = configuration.screen;

  function checkAssetsComplete(level, onComplete) {
    if (imagesComplete && soundsComplete) {
      onComplete( new Level(imageAssets, soundAssets, level) )
    }
  }

  function completeImageLoading(level, onComplete, objects) {
    imagesComplete = true;
    imageAssets = objects;
    var objectsWithAssets = {};
    for (var objectName in level) {
      if (imageAssets.get(objectName)) {
        objectsWithAssets[objectName] = level[objectName];
      }
    }
    ObjectPipeline.displayVisibleObjects(screen, objectsWithAssets);
    checkAssetsComplete(level, onComplete);
  }

  function loadImageAssets(level, onComplete) {
    var imageAssetLoader = new AssetLoader({ jquery: jquery,
                                             htmlTagName: 'IMG',
                                             loadEvent: 'loadEvent',
                                             tagName: 'image',
                                             completeCallback: _.bind(completeImageLoading, this, level, onComplete) });
    imageAssetLoader.load(level);
  }

  function completeSoundLoading(level, onComplete, objects) {
    soundsComplete = true;
    soundAssets = objects;
    checkAssetsComplete(level, onComplete);
  }

  function loadSoundAssets(level, onComplete) {
    var soundAssetLoader = new AssetLoader({ assets: soundAssets,
                                           jquery: jquery,
                                           htmlTagName: 'audio',
                                           loadEvent: 'canplaythrough',
                                           tagName: 'sound',
                                           completeCallback: _.bind(completeSoundLoading, this, level, onComplete) });
    soundAssetLoader.load(level);
  }

  // Should make this a collection
  function addAssetsForLevel(level, onComplete) {
    loadImageAssets(level, onComplete);
    loadSoundAssets(level, onComplete);
  }
  
  this.getAssetDefinition = function() {
    return assetDefinition;
  };

  this.getJQuery = function() {
    return jquery;
  };

  this.getScreen = function() {
    return screen;
  };

  this.load = function(levelName, onComplete) {
    imagesComplete = false;
    soundsComplete = false;

    if (assetDefinition[levelName]) {
      addAssetsForLevel(assetDefinition[levelName], onComplete);
    } else {
      onComplete(new Level(new Assets(), new Assets(), {}));
    }
  }
}

module.exports = GameSpec;
