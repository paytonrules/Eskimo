var _ = require('underscore');

module.exports = {
  displayVisibleObjects: function(screen, levelSpec, level) {
    var sprite;
    for (var potentialImageObject in levelSpec) {
      if (levelSpec[potentialImageObject].sprite ) {
        sprite = level.gameObject(potentialImageObject);
        if (sprite.visible) {
          screen.put(sprite);
        }
      }
    }
  }
};
