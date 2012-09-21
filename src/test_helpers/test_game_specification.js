var GameSpec = require('../game_spec');
function TestGameSpec() {}

TestGameSpec.prototype = new GameSpec();
// This is a problem - you don't want JQuery here.  The tests don't need
// to use jquery
var TestGameSpecFactory = (function() {
  function createGameSpec(assetDefinition, jquery, screen) {
    var myJquery = function() {};
    myJquery = jquery.prototype;
    var gameSpec = new TestGameSpec(assetDefinition, jquery, screen);
    // Go through all images in the game
  }

  return {
    createGameSpec: createGameSpec
  };
})();
module.exports = TestGameSpecFactory;
