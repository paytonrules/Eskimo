var Image = require('../image');
module.exports = {
  displayVisibleObjects: function(screen, objects) {
    for(var object in objects) {
      screen.put(Image(object, objects[object]));
    }
  }
};
