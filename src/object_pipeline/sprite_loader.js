var _ = require('underscore'),
    Sprite = require('../sprite');

var SpriteLoader = {
  create: function(AssetLoader) {
    return {
      load: function(levelSpec, objectName, callback) {

        AssetLoader({
          objectName: objectName,
          object: levelSpec[objectName], 
          tagName: 'image',
          htmlTagName: 'img',
          loadEvent: 'load',
          jquery: require('jquery'),
          onComplete: _.bind(this.complete, this, objectName, levelSpec, callback)
        }).load();
      },

      complete: function(objectName, levelSpec, callback) {
        callback(objectName, Sprite(objectName, levelSpec[objectName]));
      }
    };
  }
};

module.exports = SpriteLoader;
