var SoundLoader = {
  create: function(AssetLoader) {
    return {
      load: function(levelSpec, objectName, level, callback) {
        var complete = function(object, asset) {
          level.addSoundAsset(objectName, object);
          callback(objectName, levelSpec[objectName]);
        };
      
        AssetLoader({
          htmlTagName: 'audio',
          objectName: objectName,
          object: levelSpec[objectName],
          loadEvent: 'canplaythrough',
          tagName: 'sound',
          onComplete: complete
        }).load();
      }
    };
  }
};

module.exports = SoundLoader;
