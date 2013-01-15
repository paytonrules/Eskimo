var Assets = require('./assets');

var Level = function(imageAssets, soundAssets) {
  var Jukebox = require('./jukebox'),
      levelLookup = {};

  // I think you want to get rid of the jukebox, in favor of an
  // audio object in the gameObjects.
  // This way everything could happen in the load, possibly by registering 
  // for an update when the level is loaded.
  this.getJukebox = function() {
    return Jukebox(this.soundAssets || new Assets());
  };

  this.setSoundAssets = function(soundAssets) {
    this.soundAssets = soundAssets;
  };

  this.gameObject = function(objectName) {
    return levelLookup[objectName]; 
  };

  this.addGameObject = function(objectName, object) {
    levelLookup[objectName] = object;
  };
};

var GameSpec = function(configuration) {
  var imageAssets, 
      soundAssets,
      imagesComplete = false,
      soundsComplete = false,
      Sprite = require('./sprite'),
      AssetLoaderFactory = configuration.assetLoaderFactory || require('./asset_loader_factory'),
      AssetLoader = configuration.assetLoader || require('./asset_loader'),
      ObjectPipeline = require('./object_pipeline/display_visible_objects'),
      _ = require('underscore'),
      assetDefinition = configuration.assetDefinition,
      screen = configuration.screen;

  function checkAssetsComplete(level, onComplete) {
    if (imagesComplete && soundsComplete) {
      onComplete( level );
    }
  }

  function completeAssetLoading(levelSpec, level, onComplete, objects) {
    imagesComplete = true;
    imageAssets = objects;

    var objectsWithAssets = {};
    for (var objectName in levelSpec) {
      if (imageAssets && imageAssets.get(objectName)) {
        level.addGameObject(objectName, Sprite(objectName, levelSpec[objectName]));
        objectsWithAssets[objectName] = level.gameObject(objectName);
      }
    }

    ObjectPipeline.displayVisibleObjects(screen, objectsWithAssets);
    checkAssetsComplete(level, onComplete);
  }

  function checkComplete(assetsLoaded, totalAssets, levelSpec, level, onComplete, assets) {
    if (assetsLoaded === totalAssets) {
      completeAssetLoading(levelSpec, level, onComplete, assets);
    }
  }

  function loadAssets(levelSpec, level, onComplete) {
    var assets = new Assets(),
        totalAssets = _(levelSpec).values().filter(function(value) {return !value['sound'];}).length,
        assetsLoaded = 0,
        callback = function(object, asset) {
          assetsLoaded++;
          checkComplete(assetsLoaded, totalAssets, levelSpec, level, onComplete, assets);
        };

    // Note this if statement isn't tested except by the test Game Spec object
    if (totalAssets <= 0) {
      completeAssetLoading(levelSpec, onComplete, assets);
    } else {
      for(var objectName in levelSpec) {
        if (levelSpec[objectName]['image']) {
          AssetLoader({
            objectName: objectName,
            object: levelSpec[objectName], 
            tagName: 'image',
            htmlTagName: 'img',
            loadEvent: 'load',
            jquery: require('jquery'),
            assets: assets,
            onComplete: callback//_.bind(callback, this)
          }).load();
        } else { 
          assetsLoaded++;
          var typeName = _(levelSpec[objectName]).keys()[0];
          level.addGameObject(objectName, levelSpec[objectName][typeName]);
          checkComplete(assetsLoaded, totalAssets, levelSpec, level, onComplete, assets);
        }
      }
    }
  }

  function completeSoundLoading(levelSpec, level, onComplete, objects) {
    soundsComplete = true;
    level.setSoundAssets(objects);
    checkAssetsComplete(level, onComplete);
  }

  function loadSoundAssets(levelSpec, level, onComplete) {
    var soundAssetLoader = AssetLoaderFactory.create('sound',
                                   _.bind(completeSoundLoading, this, levelSpec, level, onComplete) );
    soundAssetLoader.load(levelSpec);
  }

  // Should make this a collection
  function loadObjectsInLevel(levelSpec, level, onComplete) {
    loadAssets(levelSpec, level, onComplete);
    loadSoundAssets(levelSpec, level, onComplete);
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
    var jquery = require('jquery'),
        level = new Level(new Assets(), new Assets());
    imagesComplete = false;
    soundsComplete = false;

    if (assetDefinition[levelName]) {
      loadObjectsInLevel(jquery.extend(true, {}, assetDefinition[levelName]), level, onComplete);
    } else {
      onComplete(level);
    }
  }
}

module.exports = GameSpec;
