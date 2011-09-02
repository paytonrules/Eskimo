Eskimo.FixedGameLoop = function(scheduler, updater, screen) {
  var nextGameTick = scheduler.getTicks();
  var imageList;

  this.loop = function() {
    while (scheduler.getTicks() > nextGameTick) {
      imageList = [];
      updater.update();

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
};
