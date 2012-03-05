describe('FixedGameLoop', function() {
  var gameLoop, 
      scheduler, 
      should = require('should'),
      FixedGameLoop = require("../src/fixed-game-loop"),
      sandbox = require('sinon').sandbox.create(),
      Game,
      game;

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
    game =  { update: sandbox.stub() }
    Game = {create: sandbox.stub().returns(game) };
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('creates the game object with the screen', function() {
    FixedGameLoop.start(scheduler, Game, 'screen');

    Game.create.calledWith('screen').should.be.true;
  });

  it('executes screen.render', function() {
    var screen = {
      render: function() {}
    };
    var screenSpy = sandbox.spy(screen, "render")

    FixedGameLoop.start(scheduler, Game, screen);
    FixedGameLoop.loop();

    screenSpy.called.should.be.true;
  });

  it('Executes update on the game object, provided time has passed since the last loop call', function() {
    var screen = {render: function() {}};
    
    FixedGameLoop.start(scheduler, Game, screen);
    scheduler.tick();
    FixedGameLoop.loop();

    game.update.called.should.be.true;
  });

  it('executes multiple updates to catch up if the render takes a long time', function() {
    var screen = {
      render: function() {
        scheduler.tick();
      }
    };
    var screenSpy = sandbox.spy(screen, 'render');

    FixedGameLoop.start(scheduler, Game, screen);
    scheduler.tick();
    FixedGameLoop.loop();
    scheduler.tick();
    FixedGameLoop.loop();

    screenSpy.callCount.should.equal(2);
    game.update.callCount.should.equal(3);
  });

  it('delegates stop to the scheduler', function() {
    scheduler.stop = function() {
      scheduler.stopped = true;
    };

    FixedGameLoop.start(scheduler, Game, {});
    FixedGameLoop.stop();

    scheduler.stopped.should.be.true;
  });

  it('delegates start to the scheduler, passing it its loop method', function() {
    scheduler.start = function(loop) {
      scheduler.loop = loop;
    };

    FixedGameLoop.start(scheduler, Game, {});

    scheduler.loop.should.eql(FixedGameLoop.loop);
  });
});
