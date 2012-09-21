var _ = require('underscore');
var GameSpec = require('./game_spec');

GameSpecFactory = (function() {

  function createGameSpec(assetDefinition, jquery, screen) {
    return new GameSpec(assetDefinition, jquery, screen);
  }

  return {
    createGameSpec: createGameSpec
  };
})();

module.exports = GameSpecFactory; 
