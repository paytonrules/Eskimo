describe("GameSpecification", function() {
  var Assert = require('assert'),
      jquery = require('jquery'),
      GameSpecFactory = require('../src/game_specification'),
      GameSpec = require('../src/game_spec');

  it("creates the gameSpec", function() {
    var gameSpec = GameSpecFactory.createGameSpec({}, jquery, 'screen');

    Assert.ok(gameSpec instanceof GameSpec);
  });
});
