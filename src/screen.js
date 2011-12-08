var _ = require("underscore");
module.exports = function(canvas) {
  var context = canvas[0].getContext("2d"),
      LevelLoader = require('./level_loader'),
      imageList = [];

  function clearScreen() {
    context.fillStyle = module.exports.BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width(), canvas.height());
  };

  function put(image) {
    imageList.push(image);
  };

  this.put = put;

  this.remove = function(assetName) {
    imageList.pop(assetName);
  };

  this.render = function() {
    var assets = LevelLoader.getImageAssets(); // THIS MUST BE FAST!
    clearScreen();
    _(imageList).each(function(image) {
      var asset = assets.get(image.name);
      if (asset) {
        context.drawImage(assets.get(image.name), image.x, image.y);
      }
    });
  };

  this.clear = function() {
    imageList = [];
  };
};

module.exports.BACKGROUND_COLOR = "#aaaabb";
