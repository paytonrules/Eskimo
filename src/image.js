module.exports = function(name, gameObject) {
  var location = {x: gameObject.location ? gameObject.location.x : 0, 
                 y: gameObject.location ? gameObject.location.y : 0};

  function draw(context) {
    context.drawImage(gameObject.asset,  // This will be a DOM object 
                      location.x, 
                      location.y);
  }

  function right() {
    return location.x + gameObject.asset.width;
  }

  function bottom() {
    return location.y + gameObject.asset.height;
  }

  function withinXBounds(x) {
    return (x >= location.x && x <= right());
  }

  function withinYBounds(y) {
    return (y >= location.y && y <= bottom());
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
