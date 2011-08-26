Eskimo.FixedGameLoop = function(scheduler, updater, drawer) {
  var nextGameTick = scheduler.getTicks();
  var imageList;

  this.loop = function() {
    while (scheduler.getTicks() > nextGameTick) {
      imageList = [];
      updater.update(imageList);

      nextGameTick += scheduler.getTickTime();
    }
    drawer.draw(imageList);
  };

  this.stop = function() {
    scheduler.stop();
  };

  this.start = function() {
    scheduler.start(this.loop);
  };
};
