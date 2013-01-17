var AssetLoader = function(config) {
  this.load = function() {
    var element = config.jquery("<" + config.htmlTagName + " src='" + config.object[config.tagName]['src'] + "'>");

    element.bind(config.loadEvent, function() {
      config.object.asset = element.get(0);
      config.onComplete(config.object, element.get(0));
    });
  }
}

module.exports = function(config) {
  return new AssetLoader(config);
}
