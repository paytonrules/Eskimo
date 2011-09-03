Eskimo.Image = function(assetName, x, y) {
  var location = Eskimo.Point(x,y);
  return {
    name: assetName,
    location: location,
    x: location.x,
    y: location.y
  };
};
