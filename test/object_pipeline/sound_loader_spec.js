describe("SoundLoader", function() {
  var sandbox = require('sinon').sandbox.create(),
      assert = require('assert'),
      SoundLoader = require('../../src/object_pipeline/sound_loader'),
      Level = require('../../src/level'),
      _ = require('underscore');

  beforeEach(function() {
    sandbox.restore();
  });

  it("loads the audio assets", function() {
    var loader = {load: sandbox.stub()},
        assetLoader = function(config) {
          assert.equal(config.htmlTagName, 'audio');
          assert.equal(config.loadEvent, 'canplaythrough');
          assert.equal(config.object, 'obj');
          return loader;
        },
        soundLoader = SoundLoader.create(assetLoader);

    soundLoader.load({'name' : {'sound' : 'obj'}}, 'name');
    
    assert.ok(loader.load.called);
  });

  it("adds sound assets to the level when the audio assets are loaded", function() {
    var loader = {load: sandbox.stub()},
        assetLoader = function(config) {
          assetLoader.callback = function() {
            config.onComplete('gameObject');
          };
          return loader;
        },
        soundLoader = SoundLoader.create(assetLoader),
        level = {
          addSoundAsset: function(objectName, gameObject) {
            level[objectName] = gameObject;
          }
        };

    soundLoader.load({'name' : 'obj'}, 'name', level, sandbox.stub());
    assetLoader.callback();

    assert.strictEqual(level.name, 'gameObject');
  });

  it("calls back with the object name and the object as well", function() {
    var loader = {
      load: function() {
        this.complete(this.object, '');
      }
    }, 
        assetLoader = function(config) {
          loader.complete = config.onComplete;
          loader.object = config.object;
          return loader;
        },
        soundLoader = SoundLoader.create(assetLoader),
        level = { addSoundAsset: sandbox.stub() },
        callback = sandbox.stub();

    soundLoader.load({'name' : { 'sound' : 'obj'}}, 'name', level, callback);

    assert.ok(callback.calledWith('name', 'obj'));
  });
});
