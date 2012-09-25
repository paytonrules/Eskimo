var AssetLoader = require('./asset_loader');

var lookup = {
  image: {htmlTag: 'IMG', loadEvent: 'load'},
  sound: {htmlTag: 'audio', loadEvent: 'canplaythrough'}
};

module.exports = {
  create: function(jquery, type, completeCallback) {
    return new AssetLoader({jquery: jquery,
                            htmlTagName: lookup[type].htmlTag,
                            loadEvent: lookup[type].loadEvent,
                            tagName: type,
                            completeCallback : completeCallback});

  }
};
