describe("GameSpec", function() {
  var sandbox = require('sinon').sandbox.create(),
      GameSpec = require('../src/game_spec'),
      assert = require('assert');

  beforeEach(function() {
    sandbox.restore();
  });

  it("gives back an empty level if the asset definition is empty", function(done) {
    var gameSpec = new GameSpec({
      assetDefinition: {},
      screen: 'screen'
    });

    gameSpec.load("monkey", function(level) {
      assert.equal(0, level.getJukebox().assets.size());
      done();
    });
  });

  it("gives back an empty level if there is a matching level, but it is empty", function(done) {
    var gameSpec = new GameSpec({
      assetDefinition: {
        'monkey' : {}
      },
      screen: 'screen'
    });

    gameSpec.load("monkey", function(level) {
      assert.equal(0, level.getJukebox().assets.size());
      done();
    });
  });

  it("uses an associated loader to create a level object, if one exists", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject" : {
          "customObject" : {}
        }
      }
    };

    var customObjectLoader = {
      load: function(levelSpec, objectName, level, callback) {
        callback(objectName, {levelSpec: levelSpec, objectName: objectName, level: level});
      }
    };
  
    var gameSpec = new GameSpec({ assetDefinition: gameDescription });
    gameSpec.registerLoader('customObject', customObjectLoader);

    gameSpec.load("newLevel", function(level) {
      var loadedObject = level.gameObject('gameObject');
      assert.strictEqual(loadedObject.level, level);
    });
  });

  it("just adds the blob to the level if the type isn't registered", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject" : {
          "thingy" : {
            "prop" : "prop.thing"
          }
        }
      }
    };

    var gameSpec = new GameSpec({ assetDefinition: gameDescription });

    gameSpec.load("newLevel", function(level)  {
      var asset = level.gameObject('gameObject');
      assert.equal(asset.prop, 'prop.thing');
    });
  });

  it("doesnt fire the complete callback until all assets and sounds are finished", function() {
    var Pipeline = require("../src/object_pipeline/display_visible_objects");
    sandbox.stub(Pipeline, 'displayVisibleObjects');

    var gameDescription = {
      "newLevel": {
        "gameObject" : {
          "sound": {
            "src": "sound.mp3"
          }
        },
        "gameObject2" : {
          "image" : {
            "src": "image.png"
          }
        }
      }
    };
 
    var callback = sandbox.stub();
    var imageLoader = {
      load: function(levelSpec, objectName, level, callback) {
        this.complete = callback;
      }
    };

    var soundLoader = {
       load: function(levelSpec, objectName, level, callback) {
        this.complete = callback;
      }
    };
   
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      screen: 'screen'
    });

    gameSpec.registerLoader('image', imageLoader);
    gameSpec.registerLoader('sound', soundLoader);
    gameSpec.load("newLevel", callback);
    assert.ok(!callback.called);

    imageLoader.complete();
    assert.ok(!callback.called);

    soundLoader.complete();
    assert.ok(callback.called);
  });
  
  it("puts all the visible images on the screen after loading", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject_1" : {
          "image" : {
            "src" : "background.jpg"
          },
          "visible" : true
        },
        "gameObject_2" : {
          "image" : {
            "src" : "alsoBackground.jpg"
          },
          "visible" : true
        }
      }
    };
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      screen: 'screen'
    });

    var imageLoader = {
      load: function(levelSpec, objectName, level, callback) {
        callback(objectName, objectName);
      }
    };

    gameSpec.registerLoader('image', imageLoader);
    var Pipeline = require("../src/object_pipeline/display_visible_objects");
    var displayStub = sandbox.stub(Pipeline, "displayVisibleObjects");

    gameSpec.load("newLevel", function(level) {
      var firstParam = displayStub.args[0][0];
      assert.equal('screen', firstParam);

      var levelSpec = displayStub.args[0][1];
      assert.ok(levelSpec.gameObject_1);

      var passedInLevel = displayStub.args[0][2];
      assert.equal('gameObject_1', passedInLevel.gameObject('gameObject_1'));
      assert.equal('gameObject_2', passedInLevel.gameObject('gameObject_2'));
    });
  });

  it("does not change the original game spec when the level game objects are modified", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject_1" : {
          "type" : {
          }
        }
      }
    };
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      screen: 'screen'
    });

    gameSpec.load("newLevel", function(level) {
      var gameObject = level.gameObject("gameObject_1");
      gameObject.x = 2;
    });

    gameSpec.load("newLevel", function(level) {
      var gameObject = level.gameObject("gameObject_1");
      assert.ifError(gameObject.x);
    });
  });
});
