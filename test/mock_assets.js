module.exports = function() {
  var assets = {};

  this.add = function(name, asset, callback) {
    assets[name] = {asset: asset, callback: callback};
  };

  this.load = this.add;

  this.get = function(name) {
    return assets[name].asset;
  };

  this.makeCallbackFor = function(name, data) {
    assets[name].callback(data);
  };
};
