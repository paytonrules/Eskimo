var Level = function(imageAssets, soundAssets, levelDefinition) {
  var Jukebox = require('./jukebox');

  // I think you want to get rid of the jukebox, in favor of an
  // audio object in the gameObjects.
  // This way everything could happen in the load, possibly by registering 
  // for an update when the level is loaded.
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
      Sprite = require('./sprite'),
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

  function completeAssetLoading(level, onComplete, objects) {
    imagesComplete = true;
    imageAssets = objects;

    var objectsWithAssets = {};
    for (var objectName in level) {
      if (imageAssets.get(objectName)) {
        level[objectName] = Sprite(objectName, level[objectName]);
        objectsWithAssets[objectName] = level[objectName];
      }
    }

    ObjectPipeline.displayVisibleObjects(screen, objectsWithAssets);

    
    
    checkAssetsComplete(level, onComplete);
  }

  // callback
  // mark asset as complete
  // check if all  assets are done 

  // catch the event
  // if theres a registered handler - handle it - with callback
  // if not mark asset as complete

  function loadAssets(level, onComplete) {
    // No registered things
    // registered thing - but created synchronously
    // registered created asynchronously
    // throw event based on image name
    var assetLoader = AssetLoaderFactory.create('image', 
                     _.bind(completeAssetLoading, this, level, onComplete) );
    assetLoader.load(level);
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
  function loadObjectsInLevel(level, onComplete) {
    loadAssets(level, onComplete);
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
      loadObjectsInLevel(jquery.extend(true, {}, assetDefinition[levelName]), onComplete);
    } else {
      onComplete(new Level(new Assets(), new Assets(), {}));
    }
  }
}

module.exports = GameSpec;
