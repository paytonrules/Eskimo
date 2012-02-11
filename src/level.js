var Jukebox = require('./jukebox'),
    Level;

AssetLoader = function(configuration) {
  var totalAssets,
      loadedAssets,
      assets = configuration.assets,
      tagName = configuration.tagName,
      loadingComplete = configuration.completeCallback;
  
  function onAssetLoaded(asset) {
    loadedAssets.push(asset);
    if (loadedAssets.length === totalAssets && loadingComplete) {
      loadingComplete(loadedAssets);
    }
  }

  function loadImages(object) {
    for (var imageName in object[tagName]) {
      assets.load(imageName, object[tagName][imageName]['src'], onAssetLoaded);
    }
  }

  function calculateTotalAssets(level) {
    totalAssets = 0;
    loadedAssets = [];
    for (var object in level) {
      if (level[object][tagName]) {
        totalAssets += _.keys(level[object][tagName]).length;
      }
    }
  } 

  this.load = function(level) {
    calculateTotalAssets(level);
    for(var object in level) {
      if (level[object][tagName]) {
        loadImages(level[object]);
      }
    }
  }
};

Level = (function() {
  var imageAssets, 
      soundAssets,
      currentLevel,
      currentImages = [],
      totalImages,
      _ = require('underscore'),
      Assets = require("./assets");

  function initializeAssets(jquery) {
    imageAssets = new Assets({jquery: jquery, tag: 'IMG', loadEvent: 'load'});
    soundAssets = new Assets({jquery: jquery, tag: 'audio', loadEvent: 'canplaythrough'});
  };

  function loadSounds(object) {
    for (var soundName in object['sounds']) {
      soundAssets.load(soundName, object['sounds'][soundName]['src']);
    }
  }

  function onImageLoaded(asset) {
    currentImages.push(asset);
    if (currentImages.length === totalImages && Level.allImagesLoaded) {
      Level.allImagesLoaded(currentImages);
    }
  }

  function loadImages(object) {
    for (var imageName in object['images']) {
      imageAssets.load(imageName, object['images'][imageName]['src'], onImageLoaded);
    }
  }

  function calculateTotalImages() {
    totalImages = 0;
    currentImages = [];
    for (var object in currentLevel) {
      if (currentLevel[object]['images']) {
        totalImages += _.keys(currentLevel[object]['images']).length;
      }
    }
  } 

  function loadAssets(callbacks) {
    calculateTotalImages();
    for(var object in currentLevel) {
      for(var callback in callbacks) {
        if (currentLevel[object][callback]) {
          callbacks[callback](currentLevel[object]);
        }
      }
    }
  }

  function addAssetsForCurrentLevel() {
    imageAssets.clear();
    soundAssets.clear();
    var imageAssetLoader = new AssetLoader({assets: imageAssets, 
                                            tagName: 'images',
                                            completeCallback: Level.allImagesLoaded});
    imageAssetLoader.load(currentLevel);

    loadAssets({'sounds' : loadSounds});
    soundAssets.get("sound")
  };

  return {
    countUpdaters: function() {
      return 0;
    },

    getJukebox: function() {
      return Jukebox(soundAssets);
    },

    images: function() {
      return imageAssets;
    },

    load: function(levelName) {
      if (this.levels[levelName]) {
        currentLevel = this.levels[levelName];
        addAssetsForCurrentLevel();
      }
    },

    addImage: function(key, image) {
      imageAssets.add(key, image);
    },

    gameObject: function(objectName) {
      return currentLevel[objectName];
    },

    addGameObject: function(objectName, object) {
      currentLevel[objectName] = object;
    },

    initializeAssets: function(jquery) {
      initializeAssets(jquery);
    }
  };
})();

module.exports = Level;
