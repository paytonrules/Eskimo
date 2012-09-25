var GameSpec = require('./game_spec');

GameSpecFactory = (function() {

  function createGameSpec(assetDefinition, jquery, screen) {
    return new GameSpec({
      assetDefinition: assetDefinition,
      jquery: jquery,
      screen: screen
    });
  }

  return {
    createGameSpec: createGameSpec
  };
})();

module.exports = GameSpecFactory; 
