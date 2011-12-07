module.exports = (function() {
  var scheduler,
      nextGameTick,
      originalUpdateList,
      updaterList,
      screen;

  // You're using the composite pattern, this probably doesn't need to know
  // that this is a list of updaters
  function init(newScheduler, newUpdateList, newScreen) {
    scheduler = newScheduler;
    nextGameTick = newScheduler.getTicks();
    updaterList = newUpdateList;
    screen = newScreen;
    originalUpdateList = newUpdateList;
  }

  return {
    //init: init,
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

    start: function(newScheduler, newUpdateList, newScreen) {
      init(newScheduler, newUpdateList, newScreen);
      scheduler.start(this.loop);
    },

    // Updater list isn't really cohesive - perhaps this should be a shared object?
    // Didn't I do that already and decide it didn't work?
    // Maybe its the monostate.
    addUpdater: function(updater) {
      updaterList.add(updater);
    },

    clearUpdaters: function() {
      updaterList = originalUpdateList;
    }
  }
})();
