var _ = require('underscore');

module.exports = {
  displayVisibleObjects: function(screen, objects) {
    _(objects).each(function(sprite) {
      if (sprite.visible) {
        screen.put(sprite);
      }
    });
  }
};
