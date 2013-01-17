var _ = require('underscore'),
    Sprite = require('../sprite');

// AssetLoader should not be passet to load, should be part of creating 
// sprite laoder
var SpriteLoader = {
  // ASSET LOADER should not be passed in by the creation function - 
  // but bound by the configurer
  // You can create when passing in main
  create: function(AssetLoader) {
    return {
      load: function(levelSpec, objectName, level, callback) {

        AssetLoader({
          objectName: objectName,
          object: levelSpec[objectName], 
          tagName: 'image',
          htmlTagName: 'img',
          loadEvent: 'load',
          jquery: require('jquery'),
          onComplete: _.bind(this.complete, this, level, objectName, levelSpec, callback)
        }).load();
      },

      complete: function(level, objectName, levelSpec, callback, object, asset) {
        level.addGameObject(objectName, Sprite(objectName, levelSpec[objectName]));
        callback();
      }
    };
  }
};

module.exports = SpriteLoader;
