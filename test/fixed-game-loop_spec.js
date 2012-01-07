/*describe('FixedGameLoop', function() {
  var gameLoop, 
      scheduler, 
      gameObject,
      should = require('should'),
      FixedGameLoop = require("../src/fixed-game-loop"),
      Spies = require('./spies');

  var MockScheduler = function() {
    var ticks = 0;
    this.getTicks = function() {
      return ticks;
    },

    this.getTickTime = function() {
      return 1;
    },

    this.tick = function() {
      ticks += 1;
    },

    this.start = function() {
    }
  };

  var CallCounter = function(callback) {
    var calls = 0;
    this.call = function(imageList) {
      calls += 1;
      if (typeof(callback) !== "undefined") {
        callback();
      }
    };

    this.calls = function() {
      return calls;
    };
  };

  var GameObject = function() {
    var _ = require('underscore');
    this.update = function() {
      this.updated = true;
    }
    this.updated = false;

    this.draw = function(screen) {
      this.screen = {};
      _.extend(this.screen, screen);
    };
  };

  beforeEach( function() {
    scheduler = new MockScheduler();
    gameObject = new GameObject();
  });

  it('executes screen.render', function() {
    var screen = {
      render: function() {}
    };
    var screenSpy = Spies.spyOn(screen, "render")

    FixedGameLoop.start(scheduler, gameObject, screen);
    FixedGameLoop.loop();

    screenSpy.wasCalled().should.be.true;
  });

  it('Executes update on the game object, provided time has passed since the last loop call', function() {
    var screen = {render: function() {}};
    
    FixedGameLoop.start(scheduler, gameObject, screen);
    scheduler.tick();
    FixedGameLoop.loop();

    gameObject.updated.should.be.true;
  });

  it('calls draw on the game object, passing the screen, before render', function() {
    var screen = {render: function() {this.rendered = true;}};

    FixedGameLoop.start(scheduler, gameObject, screen);
    FixedGameLoop.loop();

    should.not.exist(gameObject.screen.rendered);
  });

  it('executes multiple updates to catch up if the draw takes a long time', function() {
    var renders = new CallCounter(function() {
      scheduler.tick();
    });

    var updates = new CallCounter();
    var screen = {render: renders.call};
    gameObject.update = updates.call;

    FixedGameLoop.start(scheduler, gameObject, screen);
    scheduler.tick();
    FixedGameLoop.loop();
    scheduler.tick();
    FixedGameLoop.loop();

    renders.calls().should.equal(2);
    updates.calls().should.equal(3);
  });

  it('delegates stop to the scheduler', function() {
    scheduler.stop = function() {
      scheduler.stopped = true;
    };

    FixedGameLoop.start(scheduler, {}, {});
    FixedGameLoop.stop();

    scheduler.stopped.should.be.true;
  });

  it('delegates start to the scheduler, passing it its loop method', function() {
    scheduler.start = function(loop) {
      scheduler.loop = loop;
    };

    FixedGameLoop.start(scheduler, {}, {});

    scheduler.loop.should.eql(FixedGameLoop.loop);
  });
});*/
