describe("Level", function() {
  var Level = require("../src/level"),
      assert = require('assert'),
      audioTag = require('./spec_helper').audioTag;

  it("allows access to the game objects", function() {
    var level = new Level();
   
    level.addGameObject("gameObject", 2);

    assert.equal(2, level.gameObject('gameObject'));
  });

  it("creates a jukebox from sound objects", function() {
    var level = new Level(),
        jquery = require('jquery'),
        element;
   
    audioTag.addToDom();
    element = jquery('<audio src="src"></audio>').get(0);

    level.addSoundAsset('soundName', {asset: element});

    assert.equal(level.getJukebox().assets.get('soundName').src, "src"); 
  });
});
