describe("TestGameSpecFactory", function() {
  var TestGameSpecFactory =  require("../../src/test_helpers/test_game_specification_factory");
  var Assert = require('assert');

  it("creates a game spec with a dummy asset loader", function() {
    var gameSpec = TestGameSpecFactory.create("asset definition", "screen");

    var TestAssetLoaderFactory = require('../../src/test_helpers/test_asset_loader_factory');

    Assert.equal(TestAssetLoaderFactory, gameSpec.getAssetLoaderFactory());
    Assert.equal("asset definition", gameSpec.getAssetDefinition());
    Assert.equal("screen", gameSpec.getScreen());
  });
});
