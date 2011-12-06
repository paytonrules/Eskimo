Eskimo.IntervalWrapper = {
  setInterval: function(fn, timeout) {
    return setInterval(fn, timeout);
  },

  clearInterval: function(timer) {
    clearInterval(timer);
  }
};
