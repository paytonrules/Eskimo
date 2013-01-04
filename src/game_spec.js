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
      AssetLoaderFactory = configuration.assetLoaderFactory || require('./asset_loader_factory'),
      ObjectPipeline = require('./object_pipeline/display_visible_objects'),
      _ = require('underscore'),
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
    var imageAssetLoader = AssetLoaderFactory.create('image', 
                     _.bind(completeImageLoading, this, level, onComplete) );
    imageAssetLoader.load(level);
  }

  function completeSoundLoading(level, onComplete, objects) {
    soundsComplete = true;
    soundAssets = objects;
    checkAssetsComplete(level, onComplete);
  }

  function loadSoundAssets(level, onComplete) {
    var soundAssetLoader = AssetLoaderFactory.create('sound',
                                   _.bind(completeSoundLoading, this, level, onComplete) );
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

  this.getScreen = function() {
    return screen;
  };

  this.getAssetLoaderFactory = function() {
    return AssetLoaderFactory;
  };

  this.load = function(levelName, onComplete) {
    var jquery = require('jquery');
    imagesComplete = false;
    soundsComplete = false;

    if (assetDefinition[levelName]) {
      addAssetsForLevel(jquery.extend(true, {}, assetDefinition[levelName]), onComplete);
    } else {
      onComplete(new Level(new Assets(), new Assets(), {}));
    }
  }
}

module.exports = GameSpec;
