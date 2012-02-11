describe("Eskimo", function() {
  // Think you got enough dependencies here?  (sigh)
  var Eskimo = require('../src/main'), 
      canvas,
      should = require('should'),
      emptyFunction = function() {},
      emptyDocument = {documentElement: null},
      jquery = require("jquery"),
      level = require("../src/level"),
      FixedGameLoop = require("../src/fixed-game-loop"),
      sandbox = require('sinon').sandbox.create(),
      levels = {};

  function dependencies(customConfig) {
    var dependencyConfig = {
      game: emptyFunction,
      jquery: jquery
    };

    if (customConfig !== null) {
      jquery.extend(dependencyConfig, customConfig);
    }

    return dependencyConfig;
  }

  function configuration(config) {
    var standardConfig = {
      canvas: canvas,
      document: emptyDocument,
      levels: levels
    }

    if (config !== null) {
      jquery.extend(standardConfig, config);
    }

    return standardConfig;
  }

  beforeEach(function() {
    sandbox.stub(FixedGameLoop, "start");
    var domCanvas = {getContext: function() {}}; 
    canvas = [domCanvas];
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("wiring dependencies", function() {

    it("uses the frame rate for the scheduler", function() {
      var FakeScheduler = function(frameRate) {
        FakeScheduler.FRAME_RATE = frameRate;

        this.getTicks = emptyFunction;
      };

      Eskimo(dependencies({scheduler: FakeScheduler})).start(configuration({FRAME_RATE: 10})); 
    
      FakeScheduler.FRAME_RATE.should.equal(10);
    });

    it("sets a sensible default of 60 for the frame rate if one isn't set", function() {
      var FakeScheduler = function(frameRate) {
        FakeScheduler.FRAME_RATE = frameRate;
        this.getTicks = emptyFunction;
      };

      Eskimo(dependencies({scheduler: FakeScheduler})).start(configuration()); 
      FakeScheduler.FRAME_RATE.should.equal(60);
    });

    it("configures the level loader with the configured levels", function() {
      Eskimo(dependencies({jquery: jquery})).start(configuration({levels: levels}));

      level.levels.should.equal(levels);
    });

    it("initializes the level loader", function() {
      var initializeAssets = sandbox.spy(level, "initializeAssets").withArgs(jquery);

      Eskimo(dependencies()).start(configuration());

      initializeAssets.called.should.be.true;
    });

    it("has the canvas on the game screen", function() {
      var MyScreen = function(theCanvas) {
        MyScreen.canvas = theCanvas;
      };
     
      Eskimo(dependencies({screen: MyScreen})).start(configuration({canvas: canvas}));
      
      MyScreen.canvas.should.equal(canvas);
    });

    it("starts the fixed game loop with the scheduler", function() {
      var sched = {fake: 'sched'};
      var FakeScheduler = function(frameRate) {
        return sched;
      };

      Eskimo(dependencies({scheduler: FakeScheduler})).start(configuration());

      FixedGameLoop.start.calledWith(sched).should.be.true;
    });

    it("starts the game loop with the screen", function() {
      var fakeScreen = {fake: 'screen'};
      var FakeScreen = function() {
        return fakeScreen;
      };

      Eskimo(dependencies({screen: FakeScreen})).start(configuration());

      FixedGameLoop.start.firstCall.args[2].should.eql(fakeScreen);
    });

    it("sends the game loop the game", function() {
      var game =  {};

      Eskimo(dependencies({game: game})).start(configuration());

      FixedGameLoop.start.firstCall.args[1].should.eql(game);
    });

    it("binds to the events", function() {
      var Events = require('../src/events');
      var eventSpy = sandbox.spy(Events, 'bind');

      Eskimo(dependencies({game: 'game'})).start(configuration());

      eventSpy.called.should.be.true;
    });
 
    it("uses a intelligent defaults", function() {
      Eskimo(dependencies()).start(configuration());
    });

  });
});
