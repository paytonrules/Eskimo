describe("Eskimo Screen", function() {
  var assets, Eskimo, Context, context, screen;

  Context = function() {
    this.drawImage = function(image, x, y) {
      imageList.push({name: image, x: x, y: y});
    };

    this.fillRect = function(x, y, width, height) {
      this.filledRect = {x: x, y: y, width: width, height: height };
    };
  };

  beforeEach(function() {
    // Simulating the DOM methods I'm calling.  Seems f'd.
    // Very 'double entry' accounting
    // Look into doing this with JSDom
    var canvas = [{
      getContext: function(contextName) {
        if (contextName === '2d') {
          return context;
        }
      }
    }];
    
    canvas.width = function() {
      return 100;
    };

    canvas.height = function() {
      return 200;
    };
      
    assets = (function() {
      var assetList = {};

      return { 
        get: function(key) {
          return assetList[key];
        }, 

        set: function(key, value) {
          assetList[key] = value;
        }
      };
    }());

    Eskimo = require("spec_helper").Eskimo;
    context = new Context();
    screen = new Eskimo.Screen(canvas, assets);

    this.addMatchers( {
      toHaveScreenClearedTo: function(color) {
        return (this.actual.fillStyle === color &&
                this.actual.filledRect.x === 0,
                this.actual.filledRect.y === 0,
                this.actual.filledRect.width === canvas.width(),
                this.actual.filledRect.height === canvas.height());
      }

   });
  });

  it("is created with a canvas", function() {
    expect(screen).not.toBeUndefined();
  });

  it("draws a asset you put on it", function() {
    spyOn(context, "drawImage");
    assets.set("background", "background.src");
    
    screen.put("background");
    screen.render();

    expect(context.drawImage).toHaveBeenCalledWith(assets.get("background"));
  });

  it("draws multiple assets", function() {
    spyOn(context, "drawImage");
    assets.set("background", "one");
    assets.set("joe", "joe momma");

    screen.put("background");
    screen.put("joe");
    screen.render();

    expect(context.drawImage).toHaveBeenCalledWith(assets.get("joe"));
  });

  it("draws the assets in the order of puts", function() {
    var images = [];
    spyOn(context, "drawImage").andCallFake(function(assetName) {
      images.push(assetName);
    });
    assets.set("one", "one");
    assets.set("two", "two");

    screen.put("two");
    screen.put("one");
    screen.render();

    expect(images).toEqual(['two', 'one']);
  });

  it("clears the screen to the configured clear color", function() {
    Eskimo.Screen.BACKGROUND_COLOR = "#aaaabb";

    screen.render();

    expect(context).toHaveScreenClearedTo("#aaaabb");
  });

  it("doesnt draw an asset if it is remove", function() {
    spyOn(context, "drawImage");
    assets.set("one", "blah");
    
    screen.put("one");
    screen.remove("one");

    screen.render();

    expect(context.drawImage).not.toHaveBeenCalled();
  });

  it("clears all placed assets from the list", function() {
    spyOn(context, "drawImage");
    assets.set("one");

    screen.put("one");
    screen.clear();
  });
});
