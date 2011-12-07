var Point = require("./point");

module.exports = function(assetName, x, y) {
  var location = Point(x,y);
  return {
    name: assetName,
    location: location,
    x: location.x,
    y: location.y
  };
};
