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
      gameLoop: emptyGameLoop
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
      jquery: jquery
    }

    if (config !== null) {
      jquery.extend(standardConfig, config);
    }

    return standardConfig;
  }

  beforeEach(function() {
    Eskimo = require("specHelper").Eskimo;
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

    it("creates the game loop with the configured drawer", function() {
      var drawer = null;
      var Drawer = function() {
        drawer = this;
      };

      var FakeGameLoop = function(irrellevant, irrellevant, drawer) {
        this.start = emptyFunction;
        FakeGameLoop.drawer = drawer;
      };

      Eskimo(dependencies({gameLoop: FakeGameLoop, 
                         drawer: Drawer})).start(configuration());

      expect(drawer).not.toBeNull();
      expect(FakeGameLoop.drawer).toEqual(drawer);
    });    
    
    it("creates the drawer with a game screen", function() {
      var Drawer = function(screen) {
        Drawer.screen = screen;
      };

      Eskimo(dependencies({drawer: Drawer})).start(configuration());

      expect(Drawer.screen.drawImage).not.toBeUndefined();
    });   
 
    it("has the assets on the game screen", function() {
      var theAssets;
     
      var Assets = function(jquery) {
        theAssets = this;
        Assets.jquery = jquery;
      };
      
      var Drawer = function(screen) {
        Drawer.screen = screen;
      };

      Eskimo(dependencies({drawer: Drawer,
                         assets: Assets})).start(configuration({jquery: jquery}));

      expect(Assets.jquery).toEqual(jquery);
      expect(Drawer.screen.assets).toEqual(theAssets);
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
        GameUpdater.assets = assets;
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

      it("sends keydown events to the updater", function() {
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

      it("passes the correct event for keydown", function() {
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
      
      it("doesn't cause an error if the updater doesn't have a keydown", function() {
        Eskimo(dependencies()).start(configuration({jquery: jquery,
                                                  document: document}));

        jquery(document.documentElement).keydown();
      });
      
      it("passes the correct event for a keyup", function() {
        var Updater = function() {
          this.keyup = function(event) {
            Updater.key = event.which;
          }
        };

        Eskimo(dependencies({updater: Updater})).start(configuration({jquery: jquery,
                                                                    document: document}));

        jquery.event.trigger({type: 'keyup',
                              which : 87 });

        expect(Updater.key).toEqual(87);
      });

      it("doesn't cause an error if the updater doesn't have a keyup", function() {
        Eskimo(dependencies()).start(configuration({jquery: jquery,
                                                  document: document}));

        jquery(document.documentElement).keyup();
      });

    });
 
    it("uses a intelligent defaults", function() {
      Eskimo(dependencies()).start(configuration());
    });

  });
});
