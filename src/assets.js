module.exports = function(options) {
  var assetList = {},
      jquery = options['jquery'],
      tag = options['tag'],
      loadEvent = options['loadEvent'],
      size = 0;

  this.get = function(key) {
    if ( assetList[key] && assetList[key].loaded ) {
      return assetList[key].get(0);
    }
    return null;
  };

  this.name = "ASSET CLASS";

  this.load = function(key, src) {
    if (assetList[key]) {
      throw {name: "Eskimo.AssetAlreadyExists", message: "Asset '" + src + "' already exists"};
    } else {
      assetList[key] = jquery("<" + tag + " src='" + src + "'>");
      assetList[key].bind(loadEvent, function() {
        if (assetList[key]) {
          assetList[key].loaded = true;
        }
      });
    }
    size++;
  };

  this.add = function(key, obj) {
    assetList[key] = obj;
    assetList[key].loaded = true;
  };

  this.size = function() {
    return size;
  };

  this.clear = function() {
    size = 0;
    assetList = {};
  };
};
