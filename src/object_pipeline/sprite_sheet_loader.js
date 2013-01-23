var SpriteSheet = require('../sprite_sheet');
module.exports = {
  create: function(AssetLoader) {
    return {
      load: function(levelSpec, objectName, level, callback) {

        var complete = function(object, asset) {
          callback(objectName, SpriteSheet(object, objectName));
        };

        AssetLoader({
          htmlTagName: 'img',
          loadEvent: 'load',
          object: levelSpec[objectName].sprite_sheet,
          onComplete: complete
        }).load();
      }
    };
  }
};
