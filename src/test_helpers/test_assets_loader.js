var _ = require('underscore');
var AssetLoaderFactory = require('../asset_loader_factory');

module.exports = function(type, completeCallback) {
  var jquery = require('jquery');
  var returnValues = [];
  var spiedJQuery = (function() {
    return function(element) {
      var returnValue = jquery(element);
      returnValues.push(returnValue);
      return returnValue;
    }
  })();

  var _assetLoader = AssetLoaderFactory.create(type, 
                                               completeCallback,
                                               spiedJQuery);

  this.load = function(level) {
    _assetLoader.load(level);
    _.each(returnValues, function(returnValue) {
      returnValue.trigger(_assetLoader.getLoadEvent());
      for(var obj in level) {
        if (level[obj].asset === returnValue[0] && level[obj].testAsset) {
          returnValue[0].width = level[obj].testAsset.width;
          returnValue[0].height = level[obj].testAsset.height;
        }
      }
    });
  }
};
