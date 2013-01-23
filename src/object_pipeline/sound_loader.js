var SoundLoader = {
  create: function(AssetLoader) {
    return {
      load: function(levelSpec, objectName, level, callback) {
        var complete = function(object, asset) {
          level.addSoundAsset(objectName, object);
          callback(objectName, object);
        };
      
        AssetLoader({
          htmlTagName: 'audio',
          object: levelSpec[objectName].sound,
          loadEvent: 'canplaythrough',
          onComplete: complete
        }).load();
      }
    };
  }
};

module.exports = SoundLoader;
