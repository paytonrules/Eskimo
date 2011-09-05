describe("Eskimo", function() {
  var Eskimo, canvas;

  var emptyFunction = function() {};
  var emptyDocument = {documentElement: null};
  var jquery = require("jquery");

  function dependencies(customConfig) {
    var emptyGameLoop = function(a, b, c) {
      this.start = emptyFunction;
    };

    var dependencyConfig = {
      updater: emptyFunction,
      gameLoop: emptyGameLoop,
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
      document: emptyDocument
    }

    if (config !== null) {
      jquery.extend(standardConfig, config);
    }

    return standardConfig;
  }

  beforeEach(function() {
    Eskimo = require("spec_helper").Eskimo;
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
      expect(FakeScheduler.FRAME_RATE).toEqual(10);
    });

    it("sets a sensible default of 60 for the frame rate if one isn't set", function() {
      var FakeScheduler = function(frameRate) {
        FakeScheduler.FRAME_RATE = frameRate;
        this.getTicks = emptyFunction;
      };

      Eskimo(dependencies({scheduler: FakeScheduler})).start(configuration()); 
      expect(FakeScheduler.FRAME_RATE).toEqual(60);
    });

    it("creates the fixed step game loop with the scheduler", function() {
      var FakeGameLoop = function(scheduler) {
        FakeGameLoop.scheduler = scheduler;
        this.start = emptyFunction;
      };

      var FakeScheduler = function(frameRate) {
        this.theScheduler = "this one";
      };

      Eskimo(dependencies({scheduler: FakeScheduler, 
                         gameLoop: FakeGameLoop})).start(configuration());

      expect(FakeGameLoop.scheduler.theScheduler).toEqual("this one");
    });

    it("creates the game loop with the screen", function() {
      var FakeGameLoop = function(irrellevant, irrellevant, screen) {
        this.start = emptyFunction;
        FakeGameLoop.screen = screen;
      };

      Eskimo(dependencies({gameLoop: FakeGameLoop})).start(configuration());

      expect(FakeGameLoop.screen.put).not.toBeUndefined();
    });    
 
    it("has the image assets on the game screen", function() {
      var theAssets;
     
      var Assets = function(options) {
        if (options['tag'] === 'IMG') {
          theAssets = this;
          Assets.jquery = options['jquery'];
          Assets.loadEvent = options['loadEvent'];
        }
      };
      
      Eskimo(dependencies({assets: Assets})).start(configuration({jquery: jquery}));

      expect(Assets.jquery).toEqual(jquery);
      expect(Assets.loadEvent).toEqual('load');
    });

    it("sets up the updater with Sound Assets", function() {
      var theSoundAssets;

      var Assets = function(options) {
        if (options['tag'] == "audio") {
          theSoundAssets = this;
          theSoundAssets.jquery = options['jquery'];
          theSoundAssets.loadEvent = options['loadEvent'];
        }
      };

      var Updater = function(assets, whocares) {
        Updater.sounds = assets.sounds;
      };

      Eskimo(dependencies({assets: Assets, updater: Updater})).start(configuration());
      
      expect(Updater.sounds).toEqual(theSoundAssets);
      expect(theSoundAssets.jquery).toEqual(jquery);
      expect(theSoundAssets.loadEvent).toEqual('canplaythrough');
    });

    it("also sets up the updater with the screen", function() {
      var Updater = function(whocares, screen) {
        Updater.screen = screen;
      };

      Eskimo(dependencies({updater: Updater})).start(configuration());
      
      expect(Updater.screen.put).not.toBeUndefined();
    });

    it("sends the configured updater to the game loop", function() {
      var theUpdater = 'unset';
      var GameUpdater = function() {
        theUpdater = this;
      };

      var FakeGameLoop = function(irrelevant, updater, irrelevant) {
        FakeGameLoop.updater = updater;
        this.start = emptyFunction;
      };

      Eskimo(dependencies({gameLoop: FakeGameLoop,
                           updater: GameUpdater})).start(configuration());

      expect(FakeGameLoop.updater).toEqual(theUpdater);
    });

    it("sends the updater the assets", function() {
      var theAssets = "unset"; 
      var GameUpdater = function(assets) {
        GameUpdater.assets = assets.images;
      };

      var Assets = function() {
        theAssets = this;
      };

      Eskimo(dependencies({assets: Assets,
                         updater: GameUpdater})).start(configuration());

      expect(GameUpdater.assets).toEqual(theAssets);
    });

    it("starts the game loop", function() {
      FakeGameLoop = function() {
        this.start = function() {
          FakeGameLoop.started = true;
        };
      };

      Eskimo(dependencies({gameLoop: FakeGameLoop})).start(configuration());

      expect(FakeGameLoop.started).toBeTruthy();
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

        expect(Updater.event).not.toBeUndefined();
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

        expect(Updater.key).toEqual(87);
      });
      
      it("doesn't cause an error if the updater doesn't have that event", function() {
        Eskimo.DOCUMENT_EVENTS = ['keydown'];
        Eskimo(dependencies()).start(configuration({jquery: jquery,
                                                  document: document}));

        expect(function() {jquery(document.documentElement).keydown() }).not.toThrow();
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

        expect(Updater.event).not.toBeUndefined();
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

        expect(Updater.mousedown).toBeTruthy();
      });

      it("does not throw an exception if the updater uasn't defined the canvas event", function() {
        Eskimo.CANVAS_EVENTS = ['mousedown'];

        Eskimo(dependencies()).start(configuration({jquery: jquery,
                                                    canvas: canvas}));

        expect(function() {jquery(canvas).mousedown() }).not.toThrow();
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

        expect(Updater.mouseup).toBeTruthy();
      });
    });
 
    it("uses a intelligent defaults", function() {
      Eskimo(dependencies()).start(configuration());
    });

  });
});
