module.exports = (function() {
  var scheduler,
      game,
      UpdaterList = require("./updater_list"),
      nextGameTick,
      originalUpdateList,
      updaterList,
      screen;

  // You're using the composite pattern, this probably doesn't need to know
  // that this is a list of updaters
  function init(newScheduler, newGame, newScreen) {
    scheduler = newScheduler;
    nextGameTick = newScheduler.getTicks();
    screen = newScreen;
    game = newGame;
    updaterList = new UpdaterList();
  }

  return {
    loop: function() {
      while (scheduler.getTicks() > nextGameTick) {
        game.update();
        updaterList.update();

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

    // Updater list isn't really cohesive - perhaps this should be a shared object?
    // Didn't I do that already and decide it didn't work?
    // Maybe its the monostate.
    addUpdater: function(updater) {
      updaterList.add(updater);
    },

    clearUpdaters: function() {
      updaterList = new UpdaterList();
    }
  }
})();
