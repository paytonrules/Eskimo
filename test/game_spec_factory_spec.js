describe("GameSpecFactory", function() {
  var Assert = require('assert'),
      GameSpecFactory = require('../src/game_spec_factory'),
      GameSpec = require('../src/game_spec');

  it("creates the gameSpec", function() {
    var gameSpec = GameSpecFactory.createGameSpec({alex: 'miller'}, 'screen');

    Assert.ok(gameSpec instanceof GameSpec);
    Assert.deepEqual({alex: 'miller'}, gameSpec.getAssetDefinition());
    Assert.equal('screen', gameSpec.getScreen());
  });
});
