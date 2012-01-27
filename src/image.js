var _ = require('underscore');
module.exports = function(gameObject) {
  var keys = _(gameObject).keys()
  var name = _(keys).first();
  var properties = gameObject[name];

  function draw(context) {
    context.drawImage(properties.asset, 
                      properties.location.x, 
                      properties.location.y);
  }

  return {
    name: name,
    draw: draw
  };
};
