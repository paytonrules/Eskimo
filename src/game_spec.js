var Assets = require('./assets'),
    _ = require('underscore'),
    Level = require('./level');

var GameSpec = function(configuration) {
  var registeredLoaders = {},
      assetDefinition = configuration.assetDefinition,
      ObjectPipeline = require('./object_pipeline/display_visible_objects'),
      screen = configuration.screen;

  function onAssetsComplete(levelSpec, level, onComplete) {
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
            onAssetsComplete(levelSpec, level, onComplete);
          }
        };

    for(var objectName in levelSpec) {
      var typeForObject = _(levelSpec[objectName]).keys()[0];

      if (registeredLoaders[typeForObject]) {
        registeredLoaders[typeForObject].load(levelSpec, objectName, level, addToLevel);
      } else { 
        addToLevel(objectName, levelSpec[objectName][typeForObject]);
      }
    }
  }

  this.load = function(levelName, onComplete) {
    var jquery = require('jquery'),
        level = new Level();

    if (assetDefinition[levelName] && _(assetDefinition[levelName]).keys().length > 0) {
      loadAssets(jquery.extend(true, {}, assetDefinition[levelName]), level, onComplete);
    } else {
      onComplete(level);
    }
  };

  // These getters are used by the test proxy
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
};

module.exports = GameSpec;
