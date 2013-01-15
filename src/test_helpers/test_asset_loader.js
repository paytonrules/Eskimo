var AssetLoader = require('../asset_loader');
var _ = require('underscore');

module.exports = function(config) {
  var returnValues = [],
      spiedJQuery = (function() {
    return function(element) {
      var returnValue = config.jquery(element);
      returnValues.push(returnValue);
      return returnValue;
    }
  })(),
      newConfig = _.clone(config),
      _assetLoader,
      originalLoad;
  
  newConfig.jquery = spiedJQuery;
  assetLoader = AssetLoader(newConfig);
  var originalLoad = _assetLoader.load;

  _assetLoader.load = function() {
    originalLoad();
    _.each(returnValues, function(returnValue) {
      returnValue.trigger(config.loadEvent);
      for(var obj in level) {
        // NOTE this only works with test objects
        // Certainly a better way
        if (level[obj].asset === returnValue[0] && level[obj].testAsset) {
          returnValue[0].width = level[obj].testAsset.width;
          returnValue[0].height = level[obj].testAsset.height;
        }
      }
    });
  };

  return _assetLoader;
};
