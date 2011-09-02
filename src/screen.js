Eskimo.Screen = function(canvas, assets) {
  var context = canvas[0].getContext("2d");
  var assetList = [];

  function clearScreen() {
    context.fillStyle = Eskimo.Screen.BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width(), canvas.height());
  }

  this.put = function(assetName) {
    assetList.push(assetName);
  };

  this.remove = function(assetName) {
    assetList.pop(assetName);
  };

  this.render = function() {
    clearScreen();
    _(assetList).each(function(assetName) {
      context.drawImage(assets.get(assetName));
    });
  };

  this.clear = function() {
    assetList = [];
  };
};

Eskimo.Screen.BACKGROUND_COLOR = "#aaaabb";
