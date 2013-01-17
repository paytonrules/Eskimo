var Assets = require('./assets'),
    _ = require('underscore'),
    Level = require('./level');

var GameSpec = function(configuration) {
  var soundAssets,
      registeredLoaders = {},
      soundsComplete = false,
      AssetLoaderFactory = configuration.assetLoaderFactory || require('./asset_loader_factory'),
      AssetLoader = configuration.assetLoader || require('./asset_loader'),
      assetDefinition = configuration.assetDefinition,
      ObjectPipeline = require('./object_pipeline/display_visible_objects'),
      screen = configuration.screen;

  function checkAssetsComplete(levelSpec, level, onComplete) {
    if (soundsComplete) {
      ObjectPipeline.displayVisibleObjects(screen, levelSpec, level);
      onComplete( level );
    }
  }

  function loadAssets(levelSpec, level, onComplete) {
    var totalAssets = _(levelSpec).values().filter(function(value) {return !value['sound'];}).length,
        assetsLoaded = 0,
        callback = function(object, asset) {
          assetsLoaded++;
          if (assetsLoaded === totalAssets) {
            checkAssetsComplete(levelSpec, level, onComplete);
          }
        };

    // Note this if statement isn't tested except by the test Game Spec object
    if (totalAssets <= 0) {
      checkAssetsComplete(levelSpec, level, onComplete);
    } else {
      for(var objectName in levelSpec) {
        var typeForObject = _(levelSpec[objectName]).keys()[0];
        if (registeredLoaders[typeForObject]) {
          registeredLoaders[typeForObject].load(levelSpec, objectName, level, callback);
        } else { 
          var typeName = _(levelSpec[objectName]).keys()[0];
          level.addGameObject(objectName, levelSpec[objectName][typeName]);
          assetsLoaded++;
          if (assetsLoaded === totalAssets) {
            checkAssetsComplete(levelSpec, level, onComplete);
          }
        }
      }
    }
  }

  function completeSoundLoading(levelSpec, level, onComplete, objects) {
    soundsComplete = true;
    level.setSoundAssets(objects);
    checkAssetsComplete(levelSpec, level, onComplete);
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

  this.registerLoader = function(type, loader) {
    registeredLoaders[type] = loader.create(AssetLoader);
  };

  this.load = function(levelName, onComplete) {
    var jquery = require('jquery'),
        level = new Level(new Assets(), new Assets());
    
    soundsComplete = false;

    if (assetDefinition[levelName]) {
      loadObjectsInLevel(jquery.extend(true, {}, assetDefinition[levelName]), level, onComplete);
    } else {
      onComplete(level);
    }
  }
}

module.exports = GameSpec;
