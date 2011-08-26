Eskimo.Scheduler = function(framesPerSecond) {
  var timer;
  this.start = function(method) {
    timer = setInterval(function() { method(); }, this.getTickTime());
  };

  this.stop = function() {
    clearInterval(timer);
  };

  this.getTickTime = function() {
    return (1000 / framesPerSecond);
  };
};

Eskimo.Scheduler.prototype.getTicks = function() {
  return (new Date()).getTime();
};
