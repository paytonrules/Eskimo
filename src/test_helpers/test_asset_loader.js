var AssetLoader = require('../asset_loader');
var _ = require('underscore');

module.exports = function(config) {
  var returnValues = [],
      spiedJQuery = (function() {
    return function(element) {
      var returnValue = config.jquery(element);
      returnValues.push(returnValue);
      return returnValue;
    };
  })(),
      newConfig = _.clone(config),
      _assetLoader,
      originalLoad;
  
  newConfig.jquery = spiedJQuery;
  _assetLoader = AssetLoader(newConfig);
  originalLoad = _assetLoader.load;

  _assetLoader.load = function() {
    originalLoad();
    _.each(returnValues, function(returnValue) {
      returnValue.trigger(config.loadEvent);

      if (config.object.asset === returnValue[0] && config.object.testAsset) {
        config.object.asset.width = object.testAsset.width;
        config.object.asset.height = object.testAsset.height;
      }
    });
  };

  return _assetLoader;
};
