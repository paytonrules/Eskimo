describe('Eskimo#loop', function() {
  var gameLoop, scheduler, Eskimo;

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

  beforeEach( function() {
    Eskimo = require("spec_helper").Eskimo;
    scheduler = new MockScheduler();
  });

  it('executes screen.render', function() {
    var updater = {update: function() {}};
    var screen = {
      render: function() {}
    };
    spyOn(screen, "render")

    gameLoop = new Eskimo.FixedGameLoop(scheduler, updater, screen);
    gameLoop.loop();

    expect(screen.render).toHaveBeenCalled();
  });

  it('Executes update, provided time has passed since the last loop call', function() {
    var screen = {render: function() {}};
    var updater = {
      update: function(imageList) {
        gameLoop.updated = true;
      }
    };

    gameLoop = new Eskimo.FixedGameLoop(scheduler, updater, screen);
    scheduler.tick();
    gameLoop.loop();

    expect(gameLoop.updated).toBeTruthy();
  });

  it('executes multiple updates to catch up if the draw takes a long time', function() {
    var renders = new CallCounter(function() {
      scheduler.tick();
    });

    var updates = new CallCounter();
    var screen = {render: renders.call};
    var updater = {update: updates.call};

    gameLoop = new Eskimo.FixedGameLoop(scheduler, updater, screen);
    scheduler.tick();
    gameLoop.loop();
    scheduler.tick();
    gameLoop.loop();

    expect(renders.calls()).toEqual(2);
    expect(updates.calls()).toEqual(3);
  });

  it('delegates stop to the scheduler', function() {
    scheduler.stop = function() {
      scheduler.stopped = true;
    };

    gameLoop = new Eskimo.FixedGameLoop(scheduler, {}, {});
    gameLoop.stop();

    expect(scheduler.stopped).toBeTruthy();
  });

  it('delegates start to the scheduler, passing it its loop method', function() {
    scheduler.start = function(loop) {
      scheduler.loop = loop;
    };

    gameLoop = new Eskimo.FixedGameLoop(scheduler, {}, {});
    gameLoop.start();

    expect(scheduler.loop).toEqual(gameLoop.loop);
  });

});
