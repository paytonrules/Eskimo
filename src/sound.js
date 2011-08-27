Eskimo.Jukebox = (function() {
  var assets = null;

  function play(assetName) {
    this.assets.getSound(assetName).play();
  };

  return {
    assets: assets,
    play: play
  };
})();
