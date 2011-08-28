Eskimo.Jukebox = function(assets) {

  function play(assetName) {
    this.assets.get(assetName).play();
  };

  return {
    assets: assets,
    play: play
  };
};
