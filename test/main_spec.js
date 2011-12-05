describe("Eskimo", function() {
  // Think you got enough dependencies here?  (sigh)
  var Eskimo, 
      canvas,
      domCanvas,
      Spies = require('./spies'),
      should = require('should'),
      emptyFunction = function() {},
      emptyDocument = {documentElement: null},
      jquery = require("jquery"),
      levels = {};

  function dependencies(customConfig) {
    var dependencyConfig = {
      updater: emptyFunction,
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
    Eskimo = require("./spec_helper").Eskimo;
    Spies.stub(Eskimo.FixedGameLoop, "start").andCallFake(function(spy, args) {
      Eskimo.FixedGameLoop.updaterList = args["1"];
    });
    domCanvas = {getContext: function() {}}; 
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

      Eskimo.LevelLoader.levels.should.equal(levels);
      Eskimo.LevelLoader.countUpdaters().should.equal(0);
    });

    it("initializes the level loader", function() {
      var initializeAssets = Spies.spyOn(Eskimo.LevelLoader, "initializeAssets");

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
      var starter = Spies.spyOn(Eskimo.FixedGameLoop, "start");

      Eskimo(dependencies({scheduler: FakeScheduler})).start(configuration());

      starter.passedArguments()['0'].should.eql(sched);
    });

    it("sets up the updater with the screen", function() {
      var Updater = function(screen) {
        Updater.screen = screen;
      };

      Eskimo(dependencies({updater: Updater})).start(configuration());
      
      Updater.screen.put.should.be.ok;
    });

    it("starts the game loop with the screen", function() {
      var fakeScreen = {fake: 'screen'};
      var FakeScreen = function() {
        return fakeScreen;
      };
      var starter = Spies.spyOn(Eskimo.FixedGameLoop, "start");

      Eskimo(dependencies({screen: FakeScreen})).start(configuration());

      starter.passedArguments()['2'].should.eql(fakeScreen);
    });

    it("sends the game loop the update list - with the game updater added", function() {
      var GameUpdater = function() {
        GameUpdater.theUpdater = this;
      };

      Eskimo(dependencies({updater: GameUpdater})).start(configuration());

      Eskimo.FixedGameLoop.updaterList.size().should.equal(1);
      //expect(Eskimo.FixedGameLoop.updaterList.get(0)).toEqual(GameUpdater.theUpdater);
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

      it("sends one DOCUMENT_EVENT to the updater", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown'];
        var Updater = function() {
          this.keydown = function(event) {
            Updater.event = event;
          };
        };

        Eskimo(dependencies({updater: Updater})).start(configuration({jquery: jquery,
                                                                    document: document})); 

        jquery(document.documentElement).keydown();

        Updater.event.should.be.ok;
      });

      it("passes the correct event to the DOCUMENT EVENT", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown'];
        var Updater = function() {
          this.keydown = function(event) {
            Updater.key = event.which;
          }
        };

        Eskimo(dependencies({updater: Updater})).start(configuration({jquery: jquery,
                                                                    document: document}));
        jquery.event.trigger({type: 'keydown',
                              which: 87});

        Updater.key.should.equal(87);
      });
      
      it("doesn't cause an error if the updater doesn't have that event", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown'];
        Eskimo(dependencies()).start(configuration({jquery: jquery,
                                                  document: document}));

        jquery(document.documentElement).keydown();
      });
      
      it("works with multiple events", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown', 'keyup'];
        var Updater = function() {
          this.keyup = function(event) {
            Updater.event = event;
          };
        };

        Eskimo(dependencies({updater: Updater})).start(configuration({jquery: jquery,
                                                                      document: document})); 

        jquery(document.documentElement).keyup();

        Updater.event.should.be.ok;
      });

      it("sends CANVAS_EVENTS to the updater", function() {
        Eskimo.CANVAS_EVENTS = ['mousedown'];
        var Updater = function() {
          this.mousedown = function(event) {
            Updater.mousedown = true;
          }
        };
        
        Eskimo(dependencies({updater: Updater})).start(configuration({jquery: jquery,
                                                                      canvas: canvas}));

        jquery(canvas).mousedown();

        Updater.mousedown.should.be.true;
      });

      it("does not throw an exception if the updater uasn't defined the canvas event", function() {
        Eskimo.CANVAS_EVENTS = ['mousedown'];

        Eskimo(dependencies()).start(configuration({jquery: jquery,
                                                    canvas: canvas}));

        jquery(canvas).mousedown();
      });

      it("works with multiple CANVAS_EVENTS", function() {
        Eskimo.CANVAS_EVENTS = ['mousedown', 'mouseup'];
        var Updater = function() {
          this.mouseup = function(event) {
            Updater.mouseup = true;
          }
        };
        
        Eskimo(dependencies({updater: Updater})).start(configuration({jquery: jquery,
                                                                      canvas: canvas}));

        jquery(canvas).mouseup();

        Updater.mouseup.should.be.true;
      });
    });
 
    it("uses a intelligent defaults", function() {
      Eskimo(dependencies()).start(configuration());
    });

  });
});
