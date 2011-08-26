Eskimo.Assets = function(jquery) {
  var assetList = {};

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
};
