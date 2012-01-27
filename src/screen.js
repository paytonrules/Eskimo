var _ = require("underscore");
module.exports = function(canvas) {
  var context = canvas[0].getContext("2d"),
      imageList = [];

  function clearScreen() {
    context.fillStyle = module.exports.BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width(), canvas.height());
  };

  function put(image) {
    imageList.push(image);
  };

  this.put = put;

  this.remove = function(imageName) {
    imageList = _(imageList).reject(function(image) {
      console.log(image.name);
      return (imageName === image.name)
    });
  };

  this.render = function() {
    clearScreen();
    _(imageList).each(function(image) {
      image.draw(context);
    });
  };

  this.clear = function() {
    imageList = [];
  };

  this.findObjectNamed = function(name) {
    var matchingImage = _(imageList).detect(function(image) {
      return image.name === name;
    });

    return matchingImage;
  };
};

module.exports.BACKGROUND_COLOR = "#aaaabb";
