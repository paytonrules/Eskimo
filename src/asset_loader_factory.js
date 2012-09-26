var AssetLoader = require('./asset_loader');

var lookup = {
  image: {htmlTag: 'IMG', loadEvent: 'load'},
  sound: {htmlTag: 'audio', loadEvent: 'canplaythrough'}
};

module.exports = {
  create: function(type, completeCallback, jquery) {
    return new AssetLoader({ htmlTagName: lookup[type].htmlTag,
                             loadEvent: lookup[type].loadEvent,
                             tagName: type,
                             jquery: jquery || require('jquery'),
                             completeCallback : completeCallback});

  }
};
