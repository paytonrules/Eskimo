module.exports = {
  intersects: function(rect) {
    return !(rect.left() > this.right() ||
             rect.right() < this.left() ||
             rect.top() > this.bottom() ||
             rect.bottom() < this.top() );
  }
};
