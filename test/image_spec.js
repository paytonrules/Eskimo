describe("Image", function() {
  var sandbox = require('sinon').sandbox.create(),
      Canvas = require('canvas'),
      Image = require('../src/image'),
      canvas = new Canvas(),
      context = canvas.getContext('2d'),
      jquery = require('jquery');

  afterEach(function() {
    sandbox.restore();
  });

  it("knows its name from its game object", function() {
    var image = Image({"name" : {}});

    image.name.should.eql("name");
  });

  it("draws its asset", function() {
    // Note: I'd like to get rid of these for the canvas, 
    // instead checking what is actually on the canvas
    var canvasSpy = sandbox.stub(context, 'drawImage');
   
    var image = Image({"name" : {
                        location: {
                          x: 10, 
                          y: 20
                        },
                        asset: 'asset'
                      }});

    image.draw(context);

    canvasSpy.calledWith('asset', 10, 20).should.be.true;
  });


});
