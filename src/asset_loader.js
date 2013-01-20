var AssetLoader = function(config) {
  var jquery = config.jquery || require('jquery');

  this.load = function() {
    var element = jquery("<" + config.htmlTagName + " src='" + config.object[config.tagName].src + "'>");

    element.bind(config.loadEvent, function() {
      config.object.asset = element.get(0);
      config.onComplete(config.object, element.get(0));
    });
  };
};

module.exports = function(config) {
  return new AssetLoader(config);
};
