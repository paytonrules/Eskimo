var _ = require('underscore');
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

  return {
    name: name,
    draw: draw,
    contains: contains
  };
};
