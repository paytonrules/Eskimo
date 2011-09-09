Eskimo.UpdaterList = function(updater) {
  var list = [updater];

  this.update = function() {
    _(list).each(function(updater) {
      updater.update();
    });
  };

  this.add = function(updater) {
    list.push(updater);
  };
}
