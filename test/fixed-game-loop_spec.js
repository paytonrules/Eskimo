describe('FixedGameLoop', function() {
  var gameLoop, 
      scheduler, 
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

  beforeEach( function() {
    scheduler = new MockScheduler();
  });

  it('executes screen.render', function() {
    var updateList = {update: function() {}};
    var screen = {
      render: function() {}
    };
    var screenSpy = Spies.spyOn(screen, "render")

    FixedGameLoop.start(scheduler, updateList, screen);
    FixedGameLoop.loop();

    screenSpy.wasCalled().should.be.true;
  });

  it('Executes update, provided time has passed since the last loop call', function() {
    var screen = {render: function() {}};
    var updateList = { update: function() {} };
    var updateSpy = Spies.spyOn(updateList, "update");

    FixedGameLoop.start(scheduler, updateList, screen);
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
    var updateList = {update: updates.call};

    FixedGameLoop.start(scheduler, updateList, screen);
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

  it('will add a second updater', function() {
    var UpdaterList = require('../src/updater_list');
    var newUpdater = {update: function() {}};
    var updateSpy = Spies.spyOn(newUpdater, "update");

    FixedGameLoop.start(scheduler, new UpdaterList({update: function() {}}), {render: function() {}});
    FixedGameLoop.addUpdater(newUpdater);

    scheduler.tick();
    FixedGameLoop.loop();

    updateSpy.wasCalled().should.be.true;
  });

  it('reset the update list to the original update list', function() {
    var UpdaterList = require('../src/updater_list');
    var originalUpdater = new UpdaterList({update: function() {}});
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
