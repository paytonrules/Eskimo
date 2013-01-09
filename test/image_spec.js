describe("Image", function() {
  var sandbox = require('sinon').sandbox.create(),
      Canvas = require('canvas'),
      Image = require('../src/image'),
      canvas = new Canvas(),
      assert = require('assert'),
      context = canvas.getContext('2d');

  afterEach(function() {
    sandbox.restore();
  });

  it("takes its name from the first parameter", function() {
    var image = Image("name", {});

    image.name.should.eql("name");
  });

  it("draws its asset", function() {
    // Note: I'd like to get rid of these for the canvas, 
    // instead checking what is actually on the canvas
    var canvasSpy = sandbox.stub(context, 'drawImage');
   
    var image = Image("name", {
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
    var image = Image("name", {
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
    var image = Image("name", {
      asset: {
        width: 10
      }
    });

    image.width().should.equal(10);
  });

  it("gets the height of the asset", function() {
    var image = Image("name", {
      asset: {
        height: 10
      }
    });

    image.height().should.equal(10);
  });

  it("respects changes to the location", function() {
    var image = Image("name", {
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

});
