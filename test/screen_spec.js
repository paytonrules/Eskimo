describe("Screen", function() {
  var assets, Context, context, screen, Screen,
      Spies = require('./spies'),
      should = require('should'),
      Image = require('../src/image'),
      _ = require("underscore"),
      level,
      imagesSpy,
      helper = {};

  // Mixed styles here.  Are you gonna spy on this, or simulate.
  // Prefer simulation
  Context = function() {
    this.drawImage = function(image, x, y) {
      imageList.push({name: image, x: x, y: y});
    };

    this.fillRect = function(x, y, width, height) {
      this.filledRect = {x: x, y: y, width: width, height: height };
    };
  };

  function asArgs() {
    var hash = {},
        index = 0;

    _(arguments).each(function(arg) {
      hash[index.toString()] = arg;
      index++;
    });

    return hash;
  }

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

    Screen = require("../src/screen");
    level = require("../src/level");

    imagesSpy = Spies.stub(level, "images", assets);
    context = new Context();
    screen = new Screen(canvas);

    helper.screenClearedTo = function(context, color) {
      context.fillStyle.should.equal(color);
      context.filledRect.x.should.equal(0);
      context.filledRect.y.should.equal(0);
      context.filledRect.width.should.equal(canvas.width());
      context.filledRect.height.should.equal(canvas.height());

    };
  });

  afterEach(function() {
    imagesSpy.stopSpying();
  });


  it("is created with a canvas", function() {
    screen.should.exist;
  });

  it("draws a asset you put on it", function() {
    var contextSpy = Spies.spyOn(context, "drawImage");
    assets.load("background", "background.src");
    var image = Image("background",10, 20);
    
    screen.put(image);
    screen.render();

    contextSpy.passedArguments().should.eql(asArgs(assets.get("background"), 10, 20)); // Build into spies framework
  });

  it("draws multiple assets", function() {
    var drawSpy = Spies.spyOn(context, "drawImage");
    assets.load("background", "one");
    assets.load("joe", "joe momma");

    screen.put(Image("background", 0, 0));
    screen.put(Image("joe", 20, 30));
    screen.render();

    drawSpy.passedArguments().should.eql(asArgs(assets.get("joe"), 20, 30))
  });

  it("draws the assets in the order of puts", function() {
    var images = [];
    Spies.stub(context, "drawImage").andCallFake(function(spy, args) {
      images.push(args['0']);
    });
    assets.load("one", "one");
    assets.load("two", "two");

    screen.put(Image("two", 0, 0));
    screen.put(Image("one", 0, 0));
    screen.render();

    images.should.eql(['two', 'one']);
  });

  it("clears the screen to the configured clear color", function() {
    Screen.BACKGROUND_COLOR = "#aaaabb";

    screen.render();

    helper.screenClearedTo(context, "#aaaabb"); //expect(context).toHaveScreenClearedTo("#aaaabb");
  });

  it("doesnt draw an asset if it is remove", function() {
    var drawSpy = Spies.spyOn(context, "drawImage");
    assets.load("one", "blah");
    
    screen.put(Image("one", 10, 20));
    screen.remove("one");

    screen.render();

    drawSpy.wasCalled().should.be.false;
  });

  it("doesnt draw if the image isnt in the asset list", function() {
    var drawSpy = Spies.spyOn(context, "drawImage");

    screen.put(Image("one", 10, 20));
    screen.render();

    drawSpy.wasCalled().should.be.false;
  });

  it("clears all placed assets from the list", function() {
    var drawSpy = Spies.spyOn(context, "drawImage");
    assets.load("one", "blah");

    screen.put(Image("one", 10, 20));
    screen.clear();
    screen.render();

    drawSpy.wasCalled().should.be.false;
  });

});
