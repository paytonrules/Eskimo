var jquery = require('jquery');

module.exports = function(name, gameObject) {
  var Image = function() {
    jquery.extend(true, this, gameObject);
    jquery.extend(true, this, require('./geometry/rectangle.js'));
    this.name = name;
  };

  Image.prototype.draw = function(context) {
    context.drawImage(this.asset,  // This will be a DOM object 
                      this.location.x,
                      this.location.y);
  };

  Image.prototype.right = function() {
    return this.location.x + this.asset.width;
  };

  Image.prototype.bottom = function() {
    return this.location.y + this.asset.height;
  };

  Image.prototype.withinXBounds = function(x) {
    return (x >= this.location.x && x <= this.right());
  };

  Image.prototype.withinYBounds = function(y) {
    return (y >= this.location.y && y <= this.bottom());
  };

  Image.prototype.contains = function(x, y) {
    if (this.withinXBounds(x) && this.withinYBounds(y)) {
      return true;
    }

    return false;
  };

  Image.prototype.width = function() {
    return this.asset.width;
  };

  Image.prototype.height = function() {
    return this.asset.height;
  };

  Image.prototype.right = function() {
    return this.location.x + this.asset.width;
  };

  Image.prototype.left = function() {
    return this.location.x;
  };

  Image.prototype.bottom = function() {
    return this.location.y + this.asset.height;
  };

  Image.prototype.top = function() {
    return this.location.y;
  };

  return new Image(gameObject);
};
