describe('FixedGameLoop', function() {
  var gameLoop, 
      scheduler, 
      should = require('should'),
      FixedGameLoop = require("../src/fixed-game-loop"),
      sandbox = require('sinon').sandbox.create();

  var FakeScheduler = function() {
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

  beforeEach( function() {
    scheduler = new FakeScheduler();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('executes screen.render', function() {
    var screen = {
      render: function() {}
    };
    var screenSpy = sandbox.spy(screen, "render")

    FixedGameLoop.start(scheduler, {update: sandbox.stub()}, screen);
    FixedGameLoop.loop();

    screenSpy.called.should.be.true;
  });

  it('Executes update on the game object, provided time has passed since the last loop call', function() {
    var screen = {render: function() {}};
    var gameObject = {update: sandbox.stub()};
    
    FixedGameLoop.start(scheduler, gameObject, screen);
    scheduler.tick();
    FixedGameLoop.loop();

    gameObject.update.calledWith(screen).should.be.true;
  });

  it('executes multiple updates to catch up if the render takes a long time', function() {
    var gameObject = {update: sandbox.stub()};

    var screen = {
      render: function() {
        scheduler.tick();
      }
    };
    var screenSpy = sandbox.spy(screen, 'render');

    FixedGameLoop.start(scheduler, gameObject, screen);
    scheduler.tick();
    FixedGameLoop.loop();
    scheduler.tick();
    FixedGameLoop.loop();

    screenSpy.callCount.should.equal(2);
    gameObject.update.callCount.should.equal(3);
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
