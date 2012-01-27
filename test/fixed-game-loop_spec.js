describe('FixedGameLoop', function() {
  var gameLoop, 
      scheduler, 
      should = require('should'),
      FixedGameLoop = require("../src/fixed-game-loop"),
      sandbox = require('sinon').sandbox.create();

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

  afterEach(function() {
    sandbox.restore();
  });

  it('executes screen.render', function() {
    var screen = {
      render: function() {}
    };
    var screenSpy = sandbox.spy(screen, "render")

    FixedGameLoop.start(scheduler, {update: sandbox.stub(), draw: sandbox.stub()}, screen);
    FixedGameLoop.loop();

    screenSpy.called.should.be.true;
  });

  it('Executes update on the game object, provided time has passed since the last loop call', function() {
    var screen = {render: function() {}};
    var gameObject = {update: function() {}, draw: function() {}};
    var gameObjectSpy = sandbox.spy(gameObject, 'update');
    
    FixedGameLoop.start(scheduler, gameObject, screen);
    scheduler.tick();
    FixedGameLoop.loop();

    gameObjectSpy.calledWith(screen).should.be.true;
  });

  it('executes multiple updates to catch up if the draw takes a long time', function() {
    var renders = new CallCounter(function() {
      scheduler.tick();
    });
    var gameObject = {update: function() {}, draw: function() {}};
    var gameObjectSpy = sandbox.spy(gameObject, 'update');

    var screen = {render: renders.call};

    FixedGameLoop.start(scheduler, gameObject, screen);
    scheduler.tick();
    FixedGameLoop.loop();
    scheduler.tick();
    FixedGameLoop.loop();

    renders.calls().should.equal(2);
    gameObjectSpy.callCount.should.equal(3);
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
});
