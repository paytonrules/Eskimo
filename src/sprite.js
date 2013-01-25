var jquery = require('jquery');

module.exports = function(name, gameObject) {
  var Sprite = function() {
    jquery.extend(true, this, gameObject);
    jquery.extend(true, this, require('./geometry/rectangle.js'));
    this.name = name;
  };

  Sprite.prototype.draw = function(context) {
    context.drawImage(this.asset,  // This will be a DOM object 
                      this.location.x,
                      this.location.y);
  };

  Sprite.prototype.right = function() {
    return this.location.x + this.asset.width;
  };

  Sprite.prototype.bottom = function() {
    return this.location.y + this.asset.height;
  };

  Sprite.prototype.withinXBounds = function(x) {
    return (x >= this.location.x && x <= this.right());
  };

  Sprite.prototype.withinYBounds = function(y) {
    return (y >= this.location.y && y <= this.bottom());
  };

  Sprite.prototype.contains = function(x, y) {
    if (this.withinXBounds(x) && this.withinYBounds(y)) {
      return true;
    }

    return false;
  };

  Sprite.prototype.width = function() {
    return this.asset.width;
  };

  Sprite.prototype.height = function() {
    return this.asset.height;
  };

  Sprite.prototype.right = function() {
    return this.location.x + this.asset.width;
  };

  Sprite.prototype.left = function() {
    return this.location.x;
  };

  Sprite.prototype.bottom = function() {
    return this.location.y + this.asset.height;
  };

  Sprite.prototype.top = function() {
    return this.location.y;
  };

  return new Sprite(gameObject);
};
