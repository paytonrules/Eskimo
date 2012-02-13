module.exports = function() {
  var assets = {};

  this.add = function(name, src, callback) {
    assets[name] = {src: src, callback: callback};
  };

  this.load = this.add;

  this.get = function(name) {
    return assets[name].src;
  };

  this.makeCallbackFor = function(name, data) {
    assets[name].callback(data);
  };
};
