var Assets = require('./assets'),
    _ = require('underscore'),
    Level = require('./level');

var GameSpec = function(configuration) {
  var soundAssets,
      registeredLoaders = {},
      soundsComplete = false,
      AssetLoader = configuration.assetLoader,
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
        } else { 
          addToLevel(objectName, levelSpec[objectName][typeForObject]);
        }
      }
    }
  }

  function completeSoundsLoading(levelSpec, level, onComplete, objects) {
    soundsComplete = true;
    level.setSoundAssets(objects);
    checkAssetsComplete(levelSpec, level, onComplete);
  }

  function completeSoundLoading(levelSpec, level, onComplete, objectName, object, soundAsset) {
    var totalSounds = _(levelSpec).values().filter(function(value) {return value['sound'];}).length;
    // NOTE - you dont want jquery here
    // check do images do this?  I thought they stored elements
    //
    var jquery = require('jquery');
    soundAssets.add(objectName, jquery(soundAsset));
    if (soundAssets.size() === totalSounds) {
      completeSoundsLoading(levelSpec, level, onComplete, soundAssets);
    }
  }

  function loadSoundAssets(levelSpec, level, onComplete) {
    for(var objectName in levelSpec) {
      if (levelSpec[objectName]['sound']) {
        AssetLoader({htmlTagName: 'audio',
                     objectName: objectName,
                     object: levelSpec[objectName],
                     loadEvent: 'canplaythrough',
                     tagName: 'sound',
                     jquery: require('jquery'),
                     onComplete: _.bind(completeSoundLoading, this, levelSpec, level, onComplete, objectName)
        }).load();
      }
    }
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
    registeredLoaders[type] = loader;
  };

  this.load = function(levelName, onComplete) {
    var jquery = require('jquery'),
        level = new Level(new Assets(), new Assets());

    soundAssets = new Assets();
    
    soundsComplete = false;

    if (assetDefinition[levelName]) {
      loadObjectsInLevel(jquery.extend(true, {}, assetDefinition[levelName]), level, onComplete);
    } else {
      onComplete(level);
    }
  }
}

module.exports = GameSpec;
