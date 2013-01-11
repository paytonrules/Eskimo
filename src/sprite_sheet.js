module.exports = function(configuration) {
  var jquery = require('jquery');
  var name = arguments[1];

  var SpriteSheet = function(config, name) {
    jquery.extend(true, this, config);
    jquery.extend(true, this, require('./geometry/rectangle.js'));
    this.index = 0;
    this.name = name;
  };

  SpriteSheet.prototype.draw = function(context) {
    context.drawImage(this.asset,
                      this.map[this.index].x,
                      this.map[this.index].y,
                      this.map[this.index].width,
                      this.map[this.index].height,
                      this.location.x,
                      this.location.y,
                      this.map[this.index].width,
                      this.map[this.index].height);
  };

  SpriteSheet.prototype.right = function() {
    return this.location.x + this.map[this.index].width;
  };

  SpriteSheet.prototype.left = function() {
    return this.location.x;
  };

  SpriteSheet.prototype.top = function() {
    return this.location.y;
  };

  SpriteSheet.prototype.bottom = function() {
    return this.location.y + this.map[this.index].height;
  };
  return new SpriteSheet(configuration, name);
};
