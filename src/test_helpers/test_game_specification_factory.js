var GameSpec = require('../game_spec');
var TestAssetLoaderFactory = require('./test_asset_loader_factory');

module.exports = {
  create: function(assetDefinition, screen) {
    return new GameSpec({
      assetDefinition: assetDefinition,
      screen: screen,
      assetLoaderFactory: TestAssetLoaderFactory
    });
  }
};
