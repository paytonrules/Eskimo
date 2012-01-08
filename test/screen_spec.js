describe("Screen", function() {
  var assets, Context, context, screen, Screen,
      sandbox = require('sinon').sandbox.create(),
      should = require('should'),
      Image = require('../src/image'),
      level,
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

    sandbox.stub(level, "images").returns(assets);
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
    sandbox.restore();
  });


  it("is created with a canvas", function() {
    screen.should.exist;
  });

  it("draws a asset you put on it", function() {
    var contextSpy = sandbox.stub(context, "drawImage");
    assets.load("background", "background.src");
    var image = Image("background",10, 20);
    
    screen.put(image);
    screen.render();

    contextSpy.calledWith(assets.get("background"), 10, 20).should.be.true;
  });

  it("draws multiple assets", function() {
    var drawSpy = sandbox.stub(context, "drawImage");
    assets.load("background", "one");
    assets.load("joe", "joe momma");

    screen.put(Image("background", 0, 0));
    screen.put(Image("joe", 20, 30));
    screen.render();

    drawSpy.calledWith(assets.get("joe"), 20, 30).should.be.true;
  });

  it("draws the assets in the order of puts", function() {
    var images = [];
    sandbox.stub(context, "drawImage", function(src) {
      images.push(src);
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
    var drawSpy = sandbox.stub(context, "drawImage");
    assets.load("one", "blah");
    
    screen.put(Image("one", 10, 20));
    screen.remove("one");

    screen.render();

    drawSpy.called.should.be.false;
  });

  it("doesnt draw if the image isnt in the asset list", function() {
    var drawSpy = sandbox.stub(context, "drawImage");

    screen.put(Image("one", 10, 20));
    screen.render();

    drawSpy.called.should.be.false;
  });

  it("clears all placed assets from the list", function() {
    var drawSpy = sandbox.stub(context, "drawImage");
    assets.load("one", "blah");

    screen.put(Image("one", 10, 20));
    screen.clear();
    screen.render();

    drawSpy.called.should.be.false;
  });

});
