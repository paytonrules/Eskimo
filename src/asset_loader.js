var AssetLoader = function(config) {
  this.load = function() {
    var element = config.jquery("<" + config.htmlTagName + " src='" + config.object[config.tagName]['src'] + "'>");

    element.bind(config.loadEvent, function() {
      config.object.asset = config.assets.get(config.objectName);
      config.assets.add(config.objectName, element);
      config.onComplete(config.object, config.assets.get(config.objectName));
    });
  }
}

module.exports = function(config) {
  return new AssetLoader(config);
}
