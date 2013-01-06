describe("Screen", function() {
  var assets, Context, context, screen, Screen,
      sandbox = require('sinon').sandbox.create(),
      assert = require('assert'),
      Image = require('../src/image'),
      CANVAS_WIDTH = 100,
      CANVAS_HEIGHT = 200,
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
      return CANVAS_WIDTH;
    };

    canvas.height = function() {
      return CANVAS_HEIGHT;
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
    assert.ok(screen);
  });

  it("draws a asset you put on it", function() {
    var image = Image('name', {})
    var imageStub = sandbox.stub(image, "draw");
    
    screen.put(image);
    screen.render();

    assert.ok(imageStub.calledWith(context));
  });

  it("draws multiple assets", function() {
    var image1 = Image('name', {})
    var image2 = Image('name', {})
    var image1Stub = sandbox.stub(image1, "draw");
    var image2Stub = sandbox.stub(image2, "draw");

    screen.put(image1);
    screen.put(image2);
    screen.render();

    assert.ok(image1Stub.called);
    assert.ok(image2Stub.called);
  });

  it("draws the images in the order of puts", function() {
    var image1 = Image('name', {})
    var image2 = Image('name', {})
    var image1Stub = sandbox.stub(image1, "draw");
    var image2Stub = sandbox.stub(image2, "draw");

    screen.put(image2);
    screen.put(image1);
    screen.render();

    assert.ok(image2Stub.calledBefore(image1Stub));
  });

  it("doesnt draw an asset if it is removed", function() {
    var image = Image("one", {});
    var imageStub = sandbox.stub(image, "draw");

    screen.put(image);
    screen.remove("one");

    screen.render();

    assert.ifError(imageStub.called);
  });

  it("can find an object by its name", function() {
    var object = {name: "name"};
    screen.put(object);
    
    assert.strictEqual(screen.findObjectNamed("name"), object);
    assert.ifError(screen.findObjectNamed("anything else"));
  });

  it("clears all placed assets from the list", function() {
    var image = Image('name', {});
    var imageStub = sandbox.stub(image, "draw");

    screen.put(image);
    screen.clear();
    screen.render();

    assert.ifError(imageStub.called);
  });

  it("Respects changes to the object put on it", function() {
    var thingy = {name: 'name', location: {x: 1, y: 2}};

    screen.put(thingy);

    thingy.x = 3;

    var newThingy = screen.findObjectNamed('name');

    assert.strictEqual(newThingy.x, 3);
  });

  it("Exposes the width and height from the canvas", function() {
    assert.equal(screen.width(), CANVAS_WIDTH);
    assert.equal(screen.height(), CANVAS_HEIGHT);
  });

});
