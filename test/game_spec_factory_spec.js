describe("GameSpecification", function() {
  var Assert = require('assert'),
      jquery = require('jquery'),
      GameSpecFactory = require('../src/game_spec_factory'),
      GameSpec = require('../src/game_spec');

  it("creates the gameSpec", function() {
    var gameSpec = GameSpecFactory.createGameSpec({alex: 'miller'}, jquery, 'screen');

    Assert.ok(gameSpec instanceof GameSpec);
    Assert.deepEqual({alex: 'miller'}, gameSpec.getAssetDefinition());
    Assert.equal(jquery, gameSpec.getJQuery());
    Assert.equal('screen', gameSpec.getScreen());
  });
});
