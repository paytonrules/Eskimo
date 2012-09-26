var _ = require('underscore');
var AssetLoaderFactory = require('../asset_loader_factory');

module.exports = function(jquery, type, completeCallback) {
  var returnValues = [];
  var spiedJQuery = (function() {
    return function(element) {
      var returnValue = jquery(element);
      returnValues.push(returnValue);
      return returnValue;
    }
  })();

  var _assetLoader = AssetLoaderFactory.create(spiedJQuery, 
                                               type, 
                                               completeCallback);

  this.load = function(level) {
    _assetLoader.load(level);
    _.each(returnValues, function(returnValue) {
      returnValue.trigger(_assetLoader.getLoadEvent());
    });
  }
};
