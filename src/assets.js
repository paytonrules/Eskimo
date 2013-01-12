// Is this needed?
module.exports = function() {
  var assetList = {},
      _ = require('underscore');

  this.get = function(key) {
    if ( assetList[key]) {
      return assetList[key].get(0);
    }
    return null;
  };

  this.add = function(key, obj) {
    assetList[key] = obj; 
  };

  this.size = function() {
    return _.keys(assetList).length;
  };
};
