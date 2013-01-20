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
          jquery: require('jquery'),
          onComplete: complete //_.bind(completeSoundLoading, this, level, addToLevel, objectName)
        }).load();
      }
    };
  }
};

module.exports = SoundLoader;
