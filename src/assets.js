// Debating - maybe I should have a SoundLibrary and an ImageLibrary
Eskimo.Assets = function(jquery) {
  var assetList = {};
  var soundList = {};

  this.get = function(key) {
    if ( assetList[key] && assetList[key].loaded ) {
      return assetList[key].get(0);
    }
    return null;
  };

  this.loadImage = function(key, src) {
    if (assetList[key]) {
      throw {name: "Eskimo.AssetAlreadyExists", message: "Asset '" + src + "' already exists"};
    } else {
      assetList[key] = jquery("<img src='" + src + "'>");
      assetList[key].load(function() {
        assetList[key].loaded = true;
      });
    }
  };

  this.loadSound = function(key, src) {
    soundList[key] = jquery("<audio src='" + src + "'>");
    soundList[key].load(function() {
      soundList[key].loaded = true;
    });
  };

  this.getSound = function(key) {
    if (soundList[key] && soundList[key].loaded) {
      return soundList[key].get(0);
    }
    return null;
  };
};
