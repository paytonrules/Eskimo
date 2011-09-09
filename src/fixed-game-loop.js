Eskimo.FixedGameLoop = function(scheduler, updater, screen) {
  var nextGameTick = scheduler.getTicks(),
      updaterList = new Eskimo.UpdaterList(updater),
      imageList;

  this.loop = function() {
    while (scheduler.getTicks() > nextGameTick) {
      imageList = [];
      updaterList.update();

      nextGameTick += scheduler.getTickTime();
    }
    screen.render();
  };

  this.stop = function() {
    scheduler.stop();
  };

  this.start = function() {
    scheduler.start(this.loop);
  };

  this.addUpdater = function(updater) {
    updaterList.add(updater);
  };

  this.clearUpdaters = function() {
    updaterList = new Eskimo.UpdaterList(updater);
  };
};
