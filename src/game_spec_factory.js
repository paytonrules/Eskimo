var GameSpec = require('./game_spec');

GameSpecFactory = (function() {

  function createGameSpec(assetDefinition, screen) {
    return new GameSpec({
      assetDefinition: assetDefinition,
      screen: screen
    });
  }

  return {
    createGameSpec: createGameSpec
  };
})();

module.exports = GameSpecFactory; 
