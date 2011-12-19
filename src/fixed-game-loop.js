module.exports = (function() {
  var scheduler,
      game,
      nextGameTick,
      screen;

  function init(newScheduler, newGame, newScreen) {
    scheduler = newScheduler;
    nextGameTick = newScheduler.getTicks();
    screen = newScreen;
    game = newGame;
  }

  return {
    loop: function() {
      while (scheduler.getTicks() > nextGameTick) {
        game.update();

        nextGameTick += scheduler.getTickTime();
      }
      screen.render();
    },

    stop: function() {
      scheduler.stop();
    },

    start: function(newScheduler, newGame, newScreen) {
      init(newScheduler, newGame, newScreen);
      scheduler.start(this.loop);
    },
  }
})();
