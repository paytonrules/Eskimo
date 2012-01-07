_ = require('underscore');
module.exports = function(assets) {

  function withAsset(assetName, fn) {
    var asset = assets.get(assetName);

    if (asset !== null ) {
      fn(asset);
    }
  }

  function play(assetName) {
    withAsset(assetName, function(asset) {
      asset.play();
    });
  };
  
  function stop(assetName) {
    withAsset(assetName, function(asset) {
      asset.pause();
    });
  };

  return {
    assets: assets,
    play: play,
    stop: stop
  };
};
