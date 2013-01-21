describe("SpriteLoaderSpec", function() {
  var sandbox = require('sinon').sandbox.create(),
      SpriteLoader = require('../../src/object_pipeline/sprite_loader'),
      assert = require('assert');

  beforeEach(function() {
    sandbox.restore();
  });

  it("adds sprite assets for any sprites in level", function() {
    var gameDescription = {
      "gameObject" : {
        "sprite" : {
          "src" : "background.jpg"
        }
      }
    },
        loader = { load: sandbox.stub() },
        assetLoader = sandbox.stub().returns(loader), 
        spriteLoader = SpriteLoader.create(assetLoader);

    spriteLoader.load(gameDescription, 'gameObject');

    assert.ok(loader.load.called);
  });

  it("creates the asset loader correctly", function() {
    var loader = { load: sandbox.stub() },
        assetLoader = sandbox.stub().returns(loader), 
        spriteLoader = SpriteLoader.create(assetLoader),
        assetConfiguration;
  
    spriteLoader.load({'objectName' : {'sprite': 'spriteSpec'}}, 'objectName', 'level', 'callback');
    assetConfiguration = assetLoader.args[0][0];

    assert.equal(assetConfiguration.objectName, 'objectName');
    assert.equal(assetConfiguration.object, 'spriteSpec');
    assert.equal(assetConfiguration.htmlTagName, 'img');
    assert.equal(assetConfiguration.loadEvent, 'load');
  });

  it("uses the complete callback to send a sprite object back to the client", function() {
    var loader = { load: sandbox.stub() },
        assetLoader = sandbox.stub().returns(loader), 
        spriteLoader = SpriteLoader.create(assetLoader),
        callback = sandbox.stub(),
        assetConfiguration;

    spriteLoader.load({'objectName' : 'levelSpec'}, 
                      'objectName', 
                      'level',
                      callback);

    assetConfiguration = assetLoader.args[0][0];

    assetConfiguration.onComplete();

    assert.equal('objectName', callback.args[0][0]);
    var sprite = callback.args[0][1];

    assert.equal('objectName', sprite.name);
    assert.ok(sprite.draw);
  });
});
