var Image = require('../image');
module.exports = {
  displayVisibleObjects: function(screen, objects) {
    for(var objectName in objects) {
      if (objects[objectName].visible) {
        screen.put(Image(objectName, objects[objectName]));
      }
    }
  }
};
