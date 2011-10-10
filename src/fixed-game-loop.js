Eskimo.FixedGameLoop = (function() {
  var scheduler,
      nextGameTick,
      originalUpdater,
      updaterList,
      screen;

  return {
    init: function(newScheduler, newUpdater, newScreen) {
      scheduler = newScheduler;
      nextGameTick = newScheduler.getTicks();
      updaterList = new Eskimo.UpdaterList(newUpdater);
      screen = newScreen;
      originalUpdater = newUpdater;
    },

    loop: function() {
      while (scheduler.getTicks() > nextGameTick) {
        updaterList.update();

        nextGameTick += scheduler.getTickTime();
      }
      screen.render();
    },

    stop: function() {
      scheduler.stop();
    },

    start: function() {
      scheduler.start(this.loop);
    },

    // Updater list isn't really co-hesive - perhaps this should be a shared object?
    // Didn't I do that already and decide it didn't work?
    // Maybe its the monostate.
    addUpdater: function(updater) {
      updaterList.add(updater);
    },

    clearUpdaters: function() {
      updaterList = new Eskimo.UpdaterList(originalUpdater);
    }
  }
})();
