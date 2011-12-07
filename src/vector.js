function create2DVector(x, y) {
  function normalized() {
    var length = Math.sqrt(this.lengthSquared);

    return create2DVector(this.x / length, this.y / length);
  };

  function scaled(scaleAmt) {
    var normalizedVector = this.normalized();

    return create2DVector(normalizedVector.x * scaleAmt,
                          normalizedVector.y * scaleAmt);
  };

  return {
    x: x,
    y: y,
    lengthSquared: x*x + y*y,
    normalized: normalized,
    scaled: scaled 
  };
}

module.exports = {
  create2DVector: create2DVector
}
