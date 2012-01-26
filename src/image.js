var _ = require('underscore');
module.exports = function(gameObject) {
  var keys = _(gameObject).keys()
  var name = _(keys).first();
  var properties = gameObject[name];

/*
 *  function right() {
 *    return image().width + x;
 *  }
 *
 *  function bottom() {
 *    return image().height + y;
 *  }
 *
 */
  function draw(context) {
    context.drawImage(properties.asset, properties.location.x, properties.location.y);
  }

  return {
    name: name,
    /*
     *location: location,
     *x: location.x,
     *y: location.y,
     *right: right,
     *bottom: bottom,
     */
    draw: draw
  };
};
