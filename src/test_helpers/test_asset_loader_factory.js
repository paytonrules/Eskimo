var TestAssetsLoader = require('./test_assets_loader');

module.exports = {
  create: function(tag, callback) {
    return new TestAssetsLoader(tag, callback);
  }
}
