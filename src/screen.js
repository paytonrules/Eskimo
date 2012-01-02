var _ = require("underscore");
module.exports = function(canvas) {
  var context = canvas[0].getContext("2d"),
      level = require('./level'),
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
    clearScreen();
    _(imageList).each(function(image) {
      var asset = level.images().get(image.name);
      if (asset) {
        context.drawImage(asset, image.x, image.y);
      }
    });
  };

  this.clear = function() {
    imageList = [];
  };
};

module.exports.BACKGROUND_COLOR = "#aaaabb";
