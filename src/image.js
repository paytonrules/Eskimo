var Point = require("./point");
var Level = require("./level");

module.exports = function(asset) {
  var imageElement;

  function image() {
    if (typeof(imageElement) === "undefined") {
      imageElement = Level.images().get(assetName);
    }
    return imageElement;
  }

  function right() {
    return image().width + x;
  }

  function bottom() {
    return image().height + y;
  }

  function draw(context) {
    var asset = Level.images().get(assetName);
    if (asset) {
      context.drawImage(asset, x, y);
    }
  }

  return {
    name: assetName,
    location: location,
    x: location.x,
    y: location.y,
    right: right,
    bottom: bottom,
    draw: draw
  };
};
