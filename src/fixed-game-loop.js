module.exports = (function() {
  var scheduler,
      game,
      nextGameTick,
      screen;

  function init(newScheduler, TheGame, newScreen) {
    scheduler = newScheduler;
    nextGameTick = newScheduler.getTicks();
    screen = newScreen;
    game = TheGame.create(screen);
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

    start: function(newScheduler, TheGame, newScreen) {
      init(newScheduler, TheGame, newScreen);
      scheduler.start(this.loop);
    },
  }
})();
