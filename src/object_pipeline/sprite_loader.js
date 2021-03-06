var _ = require('underscore'),
    Sprite = require('../sprite');

var SpriteLoader = {
  create: function(AssetLoader) {
    return {
      load: function(levelSpec, objectName, level, callback) {
        var complete = function(object, asset) {
          callback(objectName, Sprite(objectName, object));
        };
        
        AssetLoader({
          object: levelSpec[objectName].sprite, 
          htmlTagName: 'img',
          loadEvent: 'load',
          onComplete: complete
        }).load();
      }
    };
  }
};

module.exports = SpriteLoader;
