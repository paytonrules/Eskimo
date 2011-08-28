Eskimo.Assets = function(jquery, tag) {
  var assetList = {};

  this.get = function(key) {
    if ( assetList[key] && assetList[key].loaded ) {
      return assetList[key].get(0);
    }
    return null;
  };

  this.load = function(key, src) {
    if (assetList[key]) {
      throw {name: "Eskimo.AssetAlreadyExists", message: "Asset '" + src + "' already exists"};
    } else {
      assetList[key] = jquery("<" + tag + " src='" + src + "'>");
      assetList[key].load(function() {
        assetList[key].loaded = true;
      });
    }
  };
};
