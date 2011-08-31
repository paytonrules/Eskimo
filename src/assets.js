Eskimo.Assets = function(options) {
  var assetList = {},
      jquery = options['jquery'],
      tag = options['tag'],
      loadEvent = options['loadEvent'];

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
      assetList[key].bind(loadEvent, function() {
        assetList[key].loaded = true;
      });
    }
  };
};
