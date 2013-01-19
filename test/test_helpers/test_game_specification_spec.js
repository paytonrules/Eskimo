describe("TestGameSpecFactory", function() {
  var TestGameSpecFactory =  require("../../src/test_helpers/test_game_specification_factory"),
      assert = require('assert'),
      audioTag = require('../spec_helper').audioTag;

  it("creates a game spec with a dummy asset loader", function() {
    var gameSpec = TestGameSpecFactory.create("asset definition", "screen");

    assert.equal("asset definition", gameSpec.getAssetDefinition());
    assert.equal("screen", gameSpec.getScreen());
  });

  it("proxies load through a singleton level, so tests can access the level", function() {
    var gameSpec = TestGameSpecFactory.create({"level" : {"Hey There" : {"sound" : {}}}}, "screen");

    gameSpec.load("level", function(level) {
      level.getJukebox().play("Hey There");
    });

    var testLevel = gameSpec.level();

    assert.ok(testLevel.playedSound("Hey There"));
  });

  it("proxies the level methods", function() {
    var gameSpec = TestGameSpecFactory.create({"level" : {"object" : {"type" : "the object"}}});

    gameSpec.load("level", function(level) {
      assert.equal(level.gameObject("object"), "the object");
    });
  });

  it("keeps track of stopped songs", function() {
    var gameSpec = TestGameSpecFactory.create({"level" : {"object" : {"sound" : {}}}});

    gameSpec.load("level", function(level) {
      level.getJukebox().stop("song");
    });

    var testLevel = gameSpec.level();

    assert.ok(testLevel.stoppedSound("song"));
  });

  it("proxies the other methods on jukebox", function() {
    audioTag.addToDom();
    var levelData = {
      "level" : { 
        "object" : {
          "sound" : {
            "src" : "the object"
          }
        }
      }
    };

    var gameSpec = TestGameSpecFactory.create(levelData);

    gameSpec.load("level", function(level) {
      var jukebox = level.getJukebox();

      assert.equal(jukebox.assets.get("object").src, "the object");
    });
  });
});
