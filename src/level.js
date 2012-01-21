var Jukebox = require('./jukebox');
module.exports = (function() {
  var imageAssets, 
      soundAssets,
      currentLevel,
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

  function loadImages(object) {
    for (var imageName in object['images']) {
      imageAssets.load(imageName, object['images'][imageName]['src']);
    }
  }

  function loadAssets(callbacks) {
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
    loadAssets({'sounds' : loadSounds,
                'images' : loadImages});
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
      console.log(objectName);
      currentLevel[objectName] = object;
    },

    initializeAssets: function(jquery) {
      initializeAssets(jquery);
    }
  };
})();
