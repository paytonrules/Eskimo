Eskimo.Scheduler = function(framesPerSecond) {
  var timer, 
      intervalWrapper = Eskimo.IntervalWrapper; 

  this.start = function(method) {
    timer = intervalWrapper.setInterval(function() { method(); }, this.getTickTime());
  };

  this.stop = function() {
    intervalWrapper.clearInterval(timer); // clearInterval(timer);
  };

  this.getTickTime = function() {
    return (1000 / framesPerSecond);
  };

  this.setIntervalWrapper = function(iv) {
    intervalWrapper = iv;
  };
};

Eskimo.Scheduler.prototype.getTicks = function() {
  return (new Date()).getTime();
};
