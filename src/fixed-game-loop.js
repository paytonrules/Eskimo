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

    addUpdater: function(updater) {
      updaterList.add(updater);
    },

    clearUpdaters: function() {
      updaterList = new Eskimo.UpdaterList(originalUpdater);
    }
  }
})();
