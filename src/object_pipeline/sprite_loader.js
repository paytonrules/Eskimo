var _ = require('underscore'),
    Sprite = require('../sprite');

var SpriteLoader = {
  create: function(AssetLoader) {
    return {
      load: function(levelSpec, objectName, level, callback) {

        AssetLoader({
          objectName: objectName,
          object: levelSpec[objectName].sprite, 
          htmlTagName: 'img',
          loadEvent: 'load',
          onComplete: _.bind(this.complete, this, objectName, levelSpec, callback)
        }).load();
      },

      complete: function(objectName, levelSpec, callback) {
        callback(objectName, Sprite(objectName, levelSpec[objectName].sprite));
      }
    };
  }
};

module.exports = SpriteLoader;
