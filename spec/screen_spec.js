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

        load: function(key, value) {
          assetList[key] = value;
        }
      };
    }());

    Eskimo = require("spec_helper").Eskimo;

    spyOn(Eskimo.LevelLoader, "getImageAssets").andReturn(assets);
    context = new Context();
    screen = new Eskimo.Screen(canvas);

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
    assets.load("background", "background.src");
    var image = Eskimo.Image("background",10, 20);
    
    screen.put(image);
    screen.render();

    expect(context.drawImage).toHaveBeenCalledWith(assets.get("background"), 10, 20);
  });

  it("draws multiple assets", function() {
    spyOn(context, "drawImage");
    assets.load("background", "one");
    assets.load("joe", "joe momma");

    screen.put(Eskimo.Image("background", 0, 0));
    screen.put(Eskimo.Image("joe", 20, 30));
    screen.render();

    expect(context.drawImage).toHaveBeenCalledWith(assets.get("joe"), 20, 30);
  });

  it("draws the assets in the order of puts", function() {
    var images = [];
    spyOn(context, "drawImage").andCallFake(function(assetName) {
      images.push(assetName);
    });
    assets.load("one", "one");
    assets.load("two", "two");

    screen.put(Eskimo.Image("two", 0, 0));
    screen.put(Eskimo.Image("one", 0, 0));
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
    assets.load("one", "blah");
    
    screen.put(Eskimo.Image("one", 10, 20));
    screen.remove("one");

    screen.render();

    expect(context.drawImage).not.toHaveBeenCalled();
  });

  it("doesnt draw if the image isnt in the asset list", function() {
    spyOn(context, "drawImage");

    screen.put(Eskimo.Image("one", 10, 20));
    screen.render();

    expect(context.drawImage).not.toHaveBeenCalled();
  });

  it("clears all placed assets from the list", function() {
    spyOn(context, "drawImage");
    assets.load("one");

    screen.put("one");
    screen.clear();
  });

});
