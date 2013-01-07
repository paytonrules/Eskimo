var jquery = require('jquery');

module.exports = function(name, gameObject) {

  function draw(context) {
    context.drawImage(gameObject.asset,  // This will be a DOM object 
                      gameObject.location.x,
                      gameObject.location.y);
  }

  function right() {
    return gameObject.location.x + gameObject.asset.width;
  }

  function bottom() {
    return gameObject.location.y + gameObject.asset.height;
  }

  function withinXBounds(x) {
    return (x >= gameObject.location.x && x <= right());
  }

  function withinYBounds(y) {
    return (y >= gameObject.location.y && y <= bottom());
  }

  function contains(x, y) {
    if (withinXBounds(x) && withinYBounds(y)) {
      return true;
    }

    return false;
  }

  function width() {
    return gameObject.asset.width();
  }

  function height() {
    return gameObject.asset.height();
  }

  var imageProps = {
    name: name,
    draw: draw,
    width: width,
    height: height,
    contains: contains
  };

  return jquery.extend(imageProps, gameObject);
};
