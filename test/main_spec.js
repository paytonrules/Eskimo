describe("Eskimo", function() {
  // Think you got enough dependencies here?  (sigh)
  var Eskimo = require('../src/main'), 
      canvas,
      Spies = require('./spies'),
      should = require('should'),
      emptyFunction = function() {},
      emptyDocument = {documentElement: null},
      jquery = require("jquery"),
      LevelLoader = require("../src/level_loader"),
      FixedGameLoop = require("../src/fixed-game-loop"),
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
    Spies.stub(FixedGameLoop, "start");
    var domCanvas = {getContext: function() {}}; 
    canvas = [domCanvas];
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

    it("configures the level loader with the configured levels, and an empty update list", function() {
      Eskimo(dependencies({jquery: jquery})).start(configuration({levels: levels}));

      LevelLoader.levels.should.equal(levels);
      LevelLoader.countUpdaters().should.equal(0);
    });

    it("initializes the level loader", function() {
      var initializeAssets = Spies.spyOn(LevelLoader, "initializeAssets");

      Eskimo(dependencies()).start(configuration());

      initializeAssets.passedArguments().should.eql([jquery]);
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
      var starter = Spies.spyOn(FixedGameLoop, "start");

      Eskimo(dependencies({scheduler: FakeScheduler})).start(configuration());

      starter.passedArguments()['0'].should.eql(sched);
    });

    it("starts the game loop with the screen", function() {
      var fakeScreen = {fake: 'screen'};
      var FakeScreen = function() {
        return fakeScreen;
      };
      var starter = Spies.spyOn(FixedGameLoop, "start");

      Eskimo(dependencies({screen: FakeScreen})).start(configuration());

      starter.passedArguments()['2'].should.eql(fakeScreen);
    });

    it("sends the game loop the game", function() {
      var gameLoopSpy = Spies.spyOn(FixedGameLoop, "start"),
          game =  {};

      Eskimo(dependencies({game: game})).start(configuration());

      gameLoopSpy.passedArguments()['1'].should.eql(game);
    });

    describe("binding events", function() {
      var document;

      beforeEach(function() {
        var jsdom = require("jsdom").jsdom,
        emptyPage = jsdom("<html><head></head><body>hello world</body></html>"),
        window   = emptyPage.createWindow();

        document = window.document;
        jquery = require("jquery").create(window);
      });

      it("sends one DOCUMENT_EVENT to the game", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown'];
        var game = {
          keydown: function(event) {
            this.event = event;
          }
        };
        Eskimo(dependencies({game: game})).start(configuration({jquery: jquery,
                                                                    document: document})); 

        jquery(document.documentElement).keydown();

        game.event.should.be.ok;
      });

      it("passes the correct event to the DOCUMENT EVENT", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown'];
        var game = {
          keydown: function(event) {
            this.key = event.which;
          }
        };

        Eskimo(dependencies({game: game})).start(configuration({jquery: jquery,
                                                                    document: document}));
        jquery.event.trigger({type: 'keydown',
                              which: 87});

        game.key.should.equal(87);
      });
      
      it("doesn't cause an error if the game doesn't have that event", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown'];
        Eskimo(dependencies()).start(configuration({jquery: jquery,
                                                  document: document}));

        jquery(document.documentElement).keydown();
      });
      
      it("works with multiple events", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown', 'keyup'];
        var game = {
          keyup: function(event) {
            this.event = event;
          }
        };

        Eskimo(dependencies({game: game})).start(configuration({jquery: jquery,
                                                                 document: document})); 

        jquery(document.documentElement).keyup();

        game.event.should.be.ok;
      });

      it("sends CANVAS_EVENTS to the game", function() {
        Eskimo.CANVAS_EVENTS = ['mousedown'];
        var game = {
          mousedown: function(event) {
            this.mousedown = true;
          }
        };
        
        Eskimo(dependencies({game: game})).start(configuration({jquery: jquery,
                                                                      canvas: canvas}));

        jquery(canvas).mousedown();

        game.mousedown.should.be.true;
      });

      it("does not throw an exception if the game uasn't defined the canvas event", function() {
        Eskimo.CANVAS_EVENTS = ['mousedown'];

        Eskimo(dependencies()).start(configuration({jquery: jquery,
                                                    canvas: canvas}));

        jquery(canvas).mousedown();
      });

      it("works with multiple CANVAS_EVENTS", function() {
        Eskimo.CANVAS_EVENTS = ['mousedown', 'mouseup'];
        var game = {
          mouseup: function(event) {
            this.mouseup = true;
          }
        };
        
        Eskimo(dependencies({game: game})).start(configuration({jquery: jquery,
                                                                canvas: canvas}));

        jquery(canvas).mouseup();

        game.mouseup.should.be.true;
      });

      it("normalizes CANVAS event locations to the canvas", function() {
        Eskimo.CANVAS_EVENTS = ['mouseup'];
        var game = {
          mouseup: function(location) {
            this.location = location;
          }
        };

        canvas.offset = function() {
          return {left: 10, top: 10};
        };

        Eskimo(dependencies({game: game})).start(configuration({jquery: jquery,
                                                                canvas: canvas}));

        jquery(canvas).trigger({ type: 'mouseup', 
                                 pageX: 15,
                                 pageY: 20});

        game.location.x.should.equal(5);
        game.location.y.should.equal(10);
      });
    });
 
    it("uses a intelligent defaults", function() {
      Eskimo(dependencies()).start(configuration());
    });

  });
});
