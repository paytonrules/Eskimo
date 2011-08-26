describe("Eskimo.Vector", function() {
  var Eskimo;

  beforeEach(function() {
    Eskimo = require("specHelper").Eskimo;
  });

  it("creates a 2d vector", function() {
    var vector = Eskimo.Vector.create2DVector(1, 4);

    expect(vector.x).toEqual(1);
    expect(vector.y).toEqual(4);
  });

  it("has a lengthSquared property", function() {
    var vector = Eskimo.Vector.create2DVector(3, 4);

    expect(vector.lengthSquared).toEqual(25);
  });

  it("returns a new normalized version of the vector", function() {
    var vector = Eskimo.Vector.create2DVector(3, 4);
    var normalizedVector = vector.normalized();

    expect(normalizedVector.x).toEqual(0.6);
    expect(normalizedVector.y).toEqual(0.8);
  });

  it("Returns a scaled version of the vector", function() {
    var vector = Eskimo.Vector.create2DVector(3, 4);
    var scaledVector = vector.scaled(2.0);

    expect(scaledVector.x).toEqual(1.2);
    expect(scaledVector.y).toEqual(1.6);
  });

});
