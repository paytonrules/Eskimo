var Jukebox = require('./jukebox');
module.exports = (function() {
  var imageAssets, 
      soundAssets,
      Assets = require("./assets"),
      FixedGameLoop = require("./fixed-game-loop");


  function initializeAssets(jquery) {
    imageAssets = new Assets({jquery: jquery, tag: 'IMG', loadEvent: 'load'});
    soundAssets = new Assets({jquery: jquery, tag: 'audio', loadEvent: 'canplaythrough'});
  };

  function addToControlList(structure, context) {
    var control;
    if (structure.control) {
      control = eval(structure.control); //Security risk
      FixedGameLoop.addUpdater(control.create(structure, context)); 
    }
  };

  function addImages(images, context) {
    var imageName,
        imageStruct,
        control;

    for(imageName in images) {
      imageStruct = images[imageName];
      imageAssets.load(imageName, imageStruct.src);
      addToControlList(imageStruct, context);
    };
  };

  function addSounds(sounds, context) {
    var soundName,
    soundStruct;

    for(soundName in sounds) {
      soundStruct = sounds[soundName];
      soundAssets.load(soundName, soundStruct.src);
      addToControlList(soundStruct, context);
    };
  };

  function addAssetsForLevel(level, context) {
    imageAssets.clear();
    soundAssets.clear();
    addImages(level['images'], context);
    addSounds(level['sounds'], context);
  };

  return {
    countUpdaters: function() {
      return 0;
    },

    getJukebox: function() {
      return Jukebox(soundAssets);
    },

    getImageAssets: function() {
      return imageAssets;
    },

    load: function(levelName, context) {
      if (this.levels[levelName]) {
        addAssetsForLevel(this.levels[levelName], context);
      }
    },

    initializeAssets: function(jquery) {
      initializeAssets(jquery);
    }
  };
})();
