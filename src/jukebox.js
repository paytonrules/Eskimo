module.exports = function(assets) {

  function play(assetName) {
    var asset = this.assets.get(assetName);

    if (asset !== null) {
      this.assets.get(assetName).play();
    }
  };

  return {
    assets: assets,
    play: play
  };
};
