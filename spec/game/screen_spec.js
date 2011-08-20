describe("Game Screen", function() {
  var assets, Game, Context, context, screen;

  Context = function() {
    imageList = [];

    this.drawImage = function(image, x, y) {
      imageList.push({name: image, x: x, y: y});
    };

    this.hasImageNamed = function(imageName) {
      return _(imageList).any(function(image) {
        return image.name === imageName; 
      });
    };

    this.fillRect = function(x, y, width, height) {
      this.filledRect = {x: x, y: y, width: width, height: height };
    };

    this.hasImageAt = function(x, y) {
      return _(imageList).any(function(image) {
        return (image.x === x && image.y === y);
      });
    };
  };

  beforeEach(function() {
    // Simulating the DOM methods I'm calling.  Seems f'd.
    // Very 'double entry' accounting
    var domCanvas = {
      getContext: function(contextName) {
        if (contextName === '2d') {
          return context;
        }
      }
    };
    
    var canvas = [domCanvas];
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

    Game = require("specHelper").Game;
    context = new Context();
    screen = new Game.Screen(canvas, assets);

    this.addMatchers( {
      toHaveImageNamed: function(imageName) { 
        return this.actual.hasImageNamed(imageName);
      },

      toHaveImageAt: function(x, y) {
        return this.actual.hasImageAt(x, y);
      },

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

  it("clears the screen to the configured clear color", function() {
    Game.config.BACKGROUND_COLOR = "#aaaabb";

    screen.clear();

    expect(context).toHaveScreenClearedTo("#aaaabb");
  });

  it("draws whatever is loaded from the asset loader on the context", function() {
    assets.set("image", "filename");
    screen.drawImage("image", 0, 0);
    
    expect(context).toHaveImageNamed("filename");
  });

  it("draws it at the right location", function() {
    assets.set("image", "filename");
    screen.drawImage("image", 100, 200);

    expect(context).toHaveImageAt(100, 200);
  });

  it("doesnt draw anything if the image does not exist", function() {
    screen.drawImage("", 100, 200);

    expect(context).not.toHaveImageAt(100, 200);
  });
});
