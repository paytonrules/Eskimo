module.exports = function(framesPerSecond) {
  var timer, 
      intervalWrapper = require('./interval_wrapper');

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

module.exports.prototype.getTicks = function() {
  return (new Date()).getTime();
};
