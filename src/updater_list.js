var _ = require("underscore");
module.exports = function(updater) {
  var list = [];

  function add(updater) {
    list.push(updater);
  };
  
  this.add = add;

  this.update = function() {
    _(list).each(function(updater) {
      updater.update();
    });
  };
  
  this.size = function() {
    return list.length;
  };

  this.get = function(index) {
    return list[index];
  };

  _(arguments).each(function(updater) {
    add(updater);
  });
}
