var TestAssetLoader = require('./test_asset_loader');

module.exports = {
  create: function(tag, callback) {
    return new TestAssetLoader(tag, callback);
  }
}
