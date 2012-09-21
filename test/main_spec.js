describe("Eskimo", function() {
  // Think you got enough dependencies here?  (sigh)
  var Eskimo = require('../src/main'), 
      canvas,
      should = require('should'),
      emptyFunction = function() {},
      emptyDocument = {documentElement: null},
      jquery = require("jquery"),
      FixedGameLoop = require("../src/fixed-game-loop"),
      ObjectPipeline = require('../src/object_pipeline/display_visible_objects.js'),
      sandbox = require('sinon').sandbox.create(),
      levels = {};

  function dependencies(customConfig) {
    var dependencyConfig = {
      game: {create: sandbox.stub().returns({})},
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
    };

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

    it("creates the gamespec from the asset definition, jquery and screen", function() {
      var theScreen = {screen: "notblank"};
      var MyScreen = function(theCanvas) {
        return theScreen;
      }

      var GameSpec = require("../src/game_spec_factory");
      var create = sandbox.stub(GameSpec, "createGameSpec").withArgs(levels, jquery, theScreen);

      Eskimo(dependencies({jquery: jquery, 
                           screen: MyScreen})).start(configuration({levels: levels}));
     
      create.called.should.eql(true); 
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

      FixedGameLoop.start.calledWith(sched).should.eql(true);
    });

    it("starts the game loop with the screen", function() {
      var fakeScreen = {fake: 'screen'};
      var FakeScreen = function() {
        return fakeScreen;
      };

      Eskimo(dependencies({screen: FakeScreen})).start(configuration());

      FixedGameLoop.start.firstCall.args[2].should.eql(fakeScreen);
    });

    it("sends the game loop the created game", function() {
      var Game =  {create: sandbox.stub().returns('game')};

      Eskimo(dependencies({game: Game})).start(configuration());

      FixedGameLoop.start.firstCall.args[1].should.eql('game');
    });

    it("creates the game with the spec and screen", function() {
      var fakeScreen = { put: sandbox.stub() };
      var FakeScreen = sandbox.stub().returns(fakeScreen);
      var Game = {create: sandbox.stub().returns({})};
      var GameSpec = require("../src/game_spec_factory");

      sandbox.stub(GameSpec, 'createGameSpec').returns('spec');

      Eskimo(dependencies({screen: FakeScreen, game: Game})).start(configuration());

      Game.create.calledWith('spec', fakeScreen).should.eql(true);
    });

    it("binds the game to the events", function() {
      var Events = require('../src/events');
      var eventSpy = sandbox.spy(Events, 'bind');
      var Game = {create: sandbox.stub().returns('game')};

      Eskimo(dependencies({game: Game})).start(configuration());

      eventSpy.args[0][0].game.should.equal('game');
    });
 
    it("uses a intelligent defaults", function() {
      Eskimo(dependencies()).start(configuration());
    });

  });
});
