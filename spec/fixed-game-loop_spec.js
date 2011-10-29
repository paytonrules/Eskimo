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

  beforeEach( function() {
    FixedGameLoop = require("spec_helper").Eskimo.FixedGameLoop;
    scheduler = new MockScheduler();
  });

  it('executes screen.render', function() {
    var updater = {update: function() {}};
    var screen = {
      render: function() {}
    };
    spyOn(screen, "render")

    FixedGameLoop.start(scheduler, updater, screen);
    FixedGameLoop.loop();

    expect(screen.render).toHaveBeenCalled();
  });

  it('Executes update, provided time has passed since the last loop call', function() {
    var screen = {render: function() {}};
    var updater = { update: function() {} };
    spyOn(updater, "update");

    FixedGameLoop.start(scheduler, updater, screen);
    scheduler.tick();
    FixedGameLoop.loop();

    expect(updater.update).toHaveBeenCalled();
  });

  it('executes multiple updates to catch up if the draw takes a long time', function() {
    var renders = new CallCounter(function() {
      scheduler.tick();
    });

    var updates = new CallCounter();
    var screen = {render: renders.call};
    var updater = {update: updates.call};

    FixedGameLoop.start(scheduler, updater, screen);
    scheduler.tick();
    FixedGameLoop.loop();
    scheduler.tick();
    FixedGameLoop.loop();

    expect(renders.calls()).toEqual(2);
    expect(updates.calls()).toEqual(3);
  });

  it('delegates stop to the scheduler', function() {
    scheduler.stop = function() {
      scheduler.stopped = true;
    };

    FixedGameLoop.start(scheduler, {}, {});
    FixedGameLoop.stop();

    expect(scheduler.stopped).toBeTruthy();
  });

  it('delegates start to the scheduler, passing it its loop method', function() {
    scheduler.start = function(loop) {
      scheduler.loop = loop;
    };

    FixedGameLoop.start(scheduler, {}, {});

    expect(scheduler.loop).toEqual(FixedGameLoop.loop);
  });

  it('will update a second updater', function() {
    var newUpdater = {update: function() {}};
    spyOn(newUpdater, "update");

    FixedGameLoop.start(scheduler, {update: function() {}}, {render: function() {}});
    FixedGameLoop.addUpdater(newUpdater);

    scheduler.tick();
    FixedGameLoop.loop();

    expect(newUpdater.update).toHaveBeenCalled();
  });

  it('reset the update list to the original updater', function() {
    var originalUpdater = {update: function() {}};
    var newUpdater = {update: function() {}};
    spyOn(newUpdater, "update");
    spyOn(originalUpdater, "update");

    FixedGameLoop.start(scheduler, originalUpdater, {render: function() {}});
    FixedGameLoop.addUpdater(newUpdater);
    FixedGameLoop.clearUpdaters();

    scheduler.tick();
    FixedGameLoop.loop();

    expect(newUpdater.update).not.toHaveBeenCalled();
    expect(originalUpdater.update).toHaveBeenCalled();
  });

});
