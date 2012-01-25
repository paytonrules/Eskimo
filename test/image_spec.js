describe("Image", function() {

  it("draws its asset", function() {
    var Canvas = require('canvas');
    var Image = require('../src/image');
    var canvas = new Canvas();
    var context = canvas.getContext('2d');
   
    // WRONG type of object - you have to give it an index into the assets
    // unless you don't - see what the assets.js is really providing. 
    var image = Image({src: "background.jpg",
                        location: {
                          x: 10, 
                          y: 20
                        }
                      });

    image.draw(context);
    
/*
 *    screen.put(image);
 *    screen.render();
 *
 *    contextSpy.calledWith(assets.get("background"), 10, 20).should.be.true;
 */
  });


});
