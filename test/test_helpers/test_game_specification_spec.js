/*describe("TestGameSpec", function() {
  var TestGameSpecFactory =  require("../../src/test_helpers/test_game_specification");
  var Assert = require('assert');
  var jquery = require('jquery');

  it("calls the callback on load after loading game objects", function(done) {
    var gameDescription = {
      "level" : {
        "gameObject" : {
          "x" : 1
        }
      }
    };
    var gameSpec = TestGameSpecFactory.createGameSpec(gameDescription, jquery, null);

    gameSpec.load("level", function(level) {
      Assert.equal(1, level.gameObject('gameObject').x);
      done();
    });
  });

  it("calls the callback on load for images, without the user explicitly calling jquery", function(done) {
    var gameDescription = {
      "level" : {
        "gameObject" : {
          "image" : { 
            "x" : 2 
          }
        }
      }
    };
    var gameSpec = TestGameSpecFactory.createGameSpec(gameDescription, jquery, null);

    gameSpec.load("level", function(level) {
      Assert.equal(1, level.images('gameObject').x);
      done();
    });
  });

  // put on screen
  // load without load event
  // load soudnd without canplaythrough event
});*/
