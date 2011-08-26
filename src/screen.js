Eskimo.Screen = function(canvas, assets) {
  var context = canvas[0].getContext("2d");
  this.assets = assets;  // For testing, for now

  this.drawImage = function(name, x, y) {
    var image = assets.get(name);

    if (image) {
      context.drawImage(assets.get(name), x, y);
    }
  };

  this.clear = function() {
    context.fillStyle = Eskimo.Screen.BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width(), canvas.height());
  };
};

Eskimo.Screen.BACKGROUND_COLOR = "#aaaabb";

