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
    level = require("../src/game_specification");

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
    var image = Image('name', {})
    var imageStub = sandbox.stub(image, "draw");
    
    screen.put(image);
    screen.render();

    imageStub.calledWith(context).should.be.true;
  });

  it("draws multiple assets", function() {
    var image1 = Image('name', {})
    var image2 = Image('name', {})
    var image1Stub = sandbox.stub(image1, "draw");
    var image2Stub = sandbox.stub(image2, "draw");

    screen.put(image1);
    screen.put(image2);
    screen.render();

    image1Stub.called.should.be.true;
    image2Stub.called.should.be.true;
  });

  it("draws the images in the order of puts", function() {
    var image1 = Image('name', {})
    var image2 = Image('name', {})
    var image1Stub = sandbox.stub(image1, "draw");
    var image2Stub = sandbox.stub(image2, "draw");

    screen.put(image2);
    screen.put(image1);
    screen.render();

    image2Stub.calledBefore(image1Stub);
  });

  it("doesnt draw an asset if it is removed", function() {
    var image = Image("one", {});
    var imageStub = sandbox.stub(image, "draw");

    screen.put(image);
    screen.remove("one");

    screen.render();

    imageStub.called.should.be.false;
  });

  it("can find an object by its name", function() {
    var object = {name: "name"};
    screen.put(object);
    
    screen.findObjectNamed("name").should.eql(object);
    should.not.exist(screen.findObjectNamed("anything else"));
  });

  it("clears all placed assets from the list", function() {
    var image = Image('name', {});
    var imageStub = sandbox.stub(image, "draw");

    screen.put(image);
    screen.clear();
    screen.render();

    imageStub.called.should.be.false;
  });

  it("Respects changes to the object put on it", function() {
    var thingy = {name: 'name', location: {x: 1, y: 2}};

    screen.put(thingy);

    thingy.x = 3;

    var newThingy = screen.findObjectNamed('name');

    newThingy.x.should.equal(3);
  });

});
