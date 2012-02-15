var _ = require('underscore');
module.exports = function(name, gameObject) {

  function draw(context) {
    context.drawImage(gameObject.asset,  // This will be a DOM object 
                      gameObject.location.x, 
                      gameObject.location.y);
  }

  return {
    name: name,
    draw: draw
  };
};
