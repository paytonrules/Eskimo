describe("Drawer", function() {
  var Eskimo, drawer, imageList;

  var screen = {
    drawImage: function(image, x, y) {
    },
    clear: function() {
    }
  };
  
  beforeEach( function() {
    Eskimo = require('specHelper').Eskimo;
    drawer = new Eskimo.Drawer(screen);
    imageList = [];
  });

  it('is error free on an empty list', function() {
    expect(function() {drawer.draw([]);}).not.toThrow();
  });

  it('draws one image', function() {
    spyOn(screen, 'drawImage');
    imageList.push({name: 'paddle', 
                    location: {x: 10, y: 20}}); 
    
    drawer.draw(imageList);

    expect(screen.drawImage).toHaveBeenCalledWith('paddle', 10, 20);
  });

  it('draws multiple images', function() {
    spyOn(screen, 'drawImage');
    imageList.push({name: 'paddle',
                    location: {x: 10, y: 20}});
    imageList.push({name: 'ball',
                    location: {x: 20, y: 40}});

    drawer.draw(imageList);

    expect(screen.drawImage).toHaveBeenCalledWith('paddle', 10, 20);
    expect(screen.drawImage).toHaveBeenCalledWith('ball', 20, 40);
  });


  it('clears the screen', function() {
    spyOn(screen, 'clear');

    drawer.draw(imageList);

    expect(screen.clear).toHaveBeenCalled();
  });

 it('calls clear on the screen first', function() {
   var callOrder = [];
   var trackClear = function() {
     callOrder.push("clear");
   };
   var trackOthers = function() {
     callOrder.push("anything Else");
   };

   imageList.push({name: 'anyImage',
                   location: {x: 20, y: 40}});

   spyOn(screen, 'clear').andCallFake(trackClear);
   spyOn(screen, 'drawImage').andCallFake(trackOthers);

   drawer.draw(imageList);

   expect(callOrder[0]).toEqual("clear");
 });


});
