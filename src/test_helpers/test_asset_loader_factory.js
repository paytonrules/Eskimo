var TestAssetLoader = require('./test_asset_loader');

module.exports = {
  create: function(jquery, tag, callback) {
    return new TestAssetLoader(jquery, tag, callback);
  }
}
