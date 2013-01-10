var _ = require('underscore');

module.exports = {
  displayVisibleObjects: function(screen, objects) {
    for(var objectName in objects) {
      if (objects[objectName].visible) {
        screen.put(objects[objectName]);
      }
    }
  }
};
