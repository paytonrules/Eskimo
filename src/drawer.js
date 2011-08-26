Eskimo.Drawer = function(screen) {
  this.draw = function(imageList) {
    screen.clear();
    _(imageList).each(function(item) {
      screen.drawImage(item.name, item.location.x, item.location.y);
    });
  };
};
