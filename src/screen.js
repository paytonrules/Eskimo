Eskimo.Screen = function(canvas, assets) {
  var context = canvas[0].getContext("2d");
  var imageList = [];

  function clearScreen() {
    context.fillStyle = Eskimo.Screen.BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width(), canvas.height());
  }

  this.put = function(image) {
    imageList.push(image);
  };

  this.remove = function(assetName) {
    imageList.pop(assetName);
  };

  this.render = function() {
    clearScreen();
    _(imageList).each(function(image) {
      var asset = assets.get(image.name);
      if (asset) {
        context.drawImage(assets.get(image.name), image.x, image.y);
      }
    });
  };

  this.clear = function() {
    imageList = [];
  };
};

Eskimo.Screen.BACKGROUND_COLOR = "#aaaabb";
