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

  it("proxies load through a singleton level, so tests can access the level", function() {
    var gameSpec = TestGameSpecFactory.create("asset definition", "screen");

    gameSpec.load("level", function(level) {
      level.getJukebox().play("Hey There");
    });

    var testLevel = gameSpec.level();

    Assert.ok(testLevel.playedSound("Hey There"));
  });

  it("proxies the level methods", function() {
    var gameSpec = TestGameSpecFactory.create({"level" : {"object" : "the object"}});

    gameSpec.load("level", function(level) {
      Assert.equal(level.gameObject("object"), "the object");
    });
  });

  it("keeps track of stopped songs", function() {
    var gameSpec = TestGameSpecFactory.create({"level" : {"object" : "the object"}});

    gameSpec.load("level", function(level) {
      level.getJukebox().stop("song");
    });

    var testLevel = gameSpec.level();

    Assert.ok(testLevel.stoppedSound("song"));
  });

  it("proxies the other methods on jukebox", function() {
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

      Assert.equal(jukebox.assets.get("object").src, "the object");
    });
  });
});
