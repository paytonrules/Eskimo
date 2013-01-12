var AssetsLoader = require('./assets_loader');

var lookup = {
  image: {htmlTag: 'IMG', loadEvent: 'load'},
  sound: {htmlTag: 'audio', loadEvent: 'canplaythrough'}
};

module.exports = {
  create: function(type, completeCallback, jquery) {
    return new AssetsLoader({ htmlTagName: lookup[type].htmlTag,
                             loadEvent: lookup[type].loadEvent,
                             tagName: type,
                             jquery: jquery || require('jquery'),
                             completeCallback : completeCallback});

  }
};
