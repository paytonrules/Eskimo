var Assets = require('./assets'),
    _ = require('underscore'),
    Level = require('./level');

var GameSpec = function(configuration) {
  var registeredLoaders = {},
      AssetLoader = configuration.assetLoader,
      assetDefinition = configuration.assetDefinition,
      ObjectPipeline = require('./object_pipeline/display_visible_objects'),
      screen = configuration.screen;

  function checkAssetsComplete(levelSpec, level, onComplete) {
    ObjectPipeline.displayVisibleObjects(screen, levelSpec, level);
    onComplete( level );
  }

  function loadAssets(levelSpec, level, onComplete) {
    var totalAssets = _.keys(levelSpec).length,
        assetsLoaded = 0,
        addToLevel = function(objectName, gameObject) {
          level.addGameObject(objectName, gameObject);
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
          registeredLoaders[typeForObject].load(levelSpec, objectName, addToLevel);
        } else if (typeForObject === "sound") {

          AssetLoader({htmlTagName: 'audio',
                      objectName: objectName,
                      object: levelSpec[objectName],
                      loadEvent: 'canplaythrough',
                      tagName: 'sound',
                      jquery: require('jquery'),
                      onComplete: _.bind(completeSoundLoading, this, level, addToLevel, objectName)
          }).load();
        } else { 
          addToLevel(objectName, levelSpec[objectName][typeForObject]);
        }
      }
    }
  }

  function completeSoundLoading(level, addToLevel, objectName, object, soundAsset) {
    level.addSoundAsset(objectName, object);
    addToLevel(objectName, object);
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
    registeredLoaders[type] = loader;
  };

  this.load = function(levelName, onComplete) {
    var jquery = require('jquery'),
        level = new Level();

    if (assetDefinition[levelName]) {
      loadAssets(jquery.extend(true, {}, assetDefinition[levelName]), level, onComplete);
    } else {
      onComplete(level);
    }
  };
};

module.exports = GameSpec;
