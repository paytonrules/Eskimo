describe('Eskimo#loop', function() {
  var gameLoop, 
      scheduler, 
      FixedGameLoop,
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

  beforeEach( function() {
    FixedGameLoop = require("./spec_helper").Eskimo.FixedGameLoop;
    scheduler = new MockScheduler();
  });

  it('executes screen.render', function() {
    var updater = {update: function() {}};
    var screen = {
      render: function() {}
    };
    var screenSpy = Spies.spyOn(screen, "render")

    FixedGameLoop.start(scheduler, updater, screen);
    FixedGameLoop.loop();

    screenSpy.wasCalled().should.be.true;
  });

  it('Executes update, provided time has passed since the last loop call', function() {
    var screen = {render: function() {}};
    var updater = { update: function() {} };
    var updateSpy = Spies.spyOn(updater, "update");

    FixedGameLoop.start(scheduler, updater, screen);
    scheduler.tick();
    FixedGameLoop.loop();

    updateSpy.wasCalled().should.be.true;
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

  it('will update a second updater', function() {
    var newUpdater = {update: function() {}};
    var updateSpy = Spies.spyOn(newUpdater, "update");

    FixedGameLoop.start(scheduler, {update: function() {}}, {render: function() {}});
    FixedGameLoop.addUpdater(newUpdater);

    scheduler.tick();
    FixedGameLoop.loop();

    updateSpy.wasCalled().should.be.true;
  });

  it('reset the update list to the original updater', function() {
    var originalUpdater = {update: function() {}};
    var newUpdater = {update: function() {}};
    var newUpdaterSpy = Spies.spyOn(newUpdater, "update");
    var originalUpdaterSpy = Spies.spyOn(originalUpdater, "update");

    FixedGameLoop.start(scheduler, originalUpdater, {render: function() {}});
    FixedGameLoop.addUpdater(newUpdater);
    FixedGameLoop.clearUpdaters();

    scheduler.tick();
    FixedGameLoop.loop();

    newUpdaterSpy.wasCalled().should.be.false;
    originalUpdaterSpy.wasCalled().should.be.true;
  });

});
