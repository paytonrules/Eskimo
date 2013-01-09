var jquery = require('jquery');

module.exports = function(name, gameObject) {
  var image = jquery.extend(true, {}, gameObject);

  function draw(context) {
    context.drawImage(image.asset,  // This will be a DOM object 
                      image.location.x,
                      image.location.y);
  }

  function right() {
    return image.location.x + image.asset.width;
  }

  function bottom() {
    return image.location.y + image.asset.height;
  }

  function withinXBounds(x) {
    return (x >= image.location.x && x <= right());
  }

  function withinYBounds(y) {
    return (y >= image.location.y && y <= bottom());
  }

  function contains(x, y) {
    if (withinXBounds(x) && withinYBounds(y)) {
      return true;
    }

    return false;
  }

  function width() {
    return image.asset.width;
  }

  function height() {
    return image.asset.height;
  }

  var imageProps = {
    name: name,
    draw: draw,
    width: width,
    height: height,
    contains: contains
  };

  return jquery.extend(true, image, imageProps);
};
