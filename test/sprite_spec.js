describe("Sprite", function() {
  var sandbox = require('sinon').sandbox.create(),
      Canvas = require('canvas'),
      Sprite = require('../src/sprite'),
      canvas = new Canvas(),
      assert = require('assert'),
      context = canvas.getContext('2d');

  afterEach(function() {
    sandbox.restore();
  });

  it("takes its name from the first parameter", function() {
    var image = Sprite("name", {});

    image.name.should.eql("name");
  });

  it("draws its asset", function() {
    // Note: I'd like to get rid of these for the canvas, 
    // instead checking what is actually on the canvas
    var canvasSpy = sandbox.stub(context, 'drawImage');
   
    var image = Sprite("name", {
                        location: {
                          x: 10, 
                          y: 20
                        },
                        asset: 'asset'
                      });

    image.draw(context);

    canvasSpy.calledWith('asset', 10, 20).should.be.true;
  });

  it("returns whether a point is inside or outside the bounding box", function() {
    var jquery = require('jquery');
    var image = Sprite("name", {
                        location: {
                          x: 1,
                          y: 1,
                        },
                        asset: jquery("<img src='blah' width='20' height='20'>")[0]
                      });

    image.contains(1, 1).should.be.true;
    image.contains(0, 1).should.be.false;
    image.contains(1, 0).should.be.false;
    image.contains(21, 21).should.be.true;
    image.contains(22, 21).should.be.false;
    image.contains(21, 22).should.be.false;
  });

  it("gets the width of the asset", function() {
    var image = Sprite("name", {
      asset: {
        width: 10
      }
    });

    image.width().should.equal(10);
  });

  it("gets the height of the asset", function() {
    var image = Sprite("name", {
      asset: {
        height: 10
      }
    });

    image.height().should.equal(10);
  });

  it("respects changes to the location", function() {
    var image = Sprite("name", {
      location: {
        x: 0,
        y: 1
      },
      asset: {
        width: 10,
        height: 10
      }
    });

    image.location = {
      x: 10,
      y: 10
    };

    assert.ok(image.contains(11, 11));
  });

  describe("intersection", function() {

    function createRectangle(x, y, right, bottom) {
      return {
        top: function() {
          return y;
        },
        left: function() {
          return x;
        },
        right: function() {
          return right;
        },
        bottom: function() {
          return bottom;
        }
      };
    }

    it("detects if the incoming rects lower right corner is in the upper left corner", function() {
      var rectangle = createRectangle(0, 0, 20, 20);

      var sprite = Sprite("name", {
        location: {
          x: 19, 
          y: 19
        },
        asset: {
          width: 1,
          height: 1
        }
      });

      assert.ok(sprite.intersects(rectangle));
    });

    it("does not intersect if the bottom overlaps but the right isn't over the location", function() {
      var rectangle = createRectangle(0, 0, 20, 20);

      var sprite = Sprite("name", {
        location: {
          x: 21,
          y: 19
        },
        asset: {
          width: 1,
          height: 1
        }
      });

      assert.ifError(sprite.intersects(rectangle));
    });

    it("does not intersect if the right overlaps but the bottom isn't over the location", function() {
      var rectangle = createRectangle(0, 0, 20, 20);

      var sprite = Sprite("name", {
        location: {
          x: 19,
          y: 21, 
        },
        asset: {
          width: 1,
          height: 1
        }
      });

      assert.ifError(sprite.intersects(rectangle));
    });

    it("does intersect if the bottom right of the sprite intersects the top left of the rectangle", function() {
      var rectangle = createRectangle(19, 19, 20, 20);

      var sprite = Sprite("name", {
        location: {
          x: 0,
          y: 0, 
        },
        asset: {
          width: 20,
          height: 20
        }
      });

      assert.ok(sprite.intersects(rectangle));
    });

    it("does not intersect if the leftmost portion of the sprite is beyond the width", function() {
      var rectangle = createRectangle(21, 19, 22, 20);

      var sprite = Sprite("name", {
        location: {
          x: 0,
          y: 0, 
        },
        asset: {
          width: 20,
          height: 20
        }
      });
      
      assert.ifError(sprite.intersects(rectangle));
    });

    it("does not intersect if the bottom is below the height", function() {
      var rectangle = createRectangle(19, 21, 22, 20);

      var sprite = Sprite("name", {
        location: {
          x: 0,
          y: 0, 
        },
        asset: {
          width: 20,
          height: 20
        }
      });
      
      assert.ifError(sprite.intersects(rectangle));
    });

    it("intersects if completely enclosed by the sprite", function() {
      var rectangle = createRectangle(10, 10, 15, 15);

      var sprite = Sprite("name", {
        location: {
          x: 0,
          y: 0, 
        },
        asset: {
          width: 20,
          height: 20
        }
      });
      
      assert.ok(sprite.intersects(rectangle));
    });
  });
});
