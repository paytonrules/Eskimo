var Point = require("./point");
var Level = require("./level");

module.exports = function(assetName, x, y) {
  var location = Point(x,y);
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

  return {
    name: assetName,
    location: location,
    x: location.x,
    y: location.y,
    right: right,
    bottom: bottom
  };
};
