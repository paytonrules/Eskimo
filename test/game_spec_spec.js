describe("GameSpec", function() {
  var sandbox = require('sinon').sandbox.create(),
      GameSpec = require('../src/game_spec'),
      assert = require('assert'),
      TestAssetLoaderFactory = require('../src/test_helpers/test_asset_loader_factory'),
      window;

  function addAudioTagToTheDOM() {
    var dom = require('jsdom').jsdom(),
        define = require('../node_modules/jsdom/lib/jsdom/level2/html').define;

    window = dom.createWindow();
    require("jquery").create(window);

    define("HTMLAudioElement", {
      tagName: 'AUDIO',
      attributes: [
        'src'
      ]
    });
  }

  beforeEach(function() {
    sandbox.restore();
  });

  it("loads no jukebox when the definition passed in is empty", function(done) {
    var gameSpec = new GameSpec({
      assetDefinition: {},
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
      load: function(levelSpec, objectName, callback) {
        callback(objectName, {levelSpec: levelSpec, objectName: objectName});
      }
    };
  
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory
    });
    gameSpec.registerLoader('customObject', customObjectLoader);

    gameSpec.load("newLevel", function(level) {
      assert.deepEqual(gameDescription['newLevel'], level.gameObject('gameObject').levelSpec);
      assert.equal('gameObject', level.gameObject('gameObject').objectName);
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

    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory,
      screen: 'screen'
    });

    gameSpec.load("newLevel", function(level)  {
      var asset = level.gameObject('gameObject');
      assert.equal('prop.thing', asset.prop);
    });
  });

  it("creates a jukebox from the sounds on the objects in the level", function() {
    addAudioTagToTheDOM();
    var gameDescription = {
      "newLevel": {
        "gameObject" : {
          "sound": {
            "src": "sound.mp3"
          }
        }
      }
    };
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory, 
      screen: 'screen'
    });

    gameSpec.load("newLevel", function(level) {
      addAudioTagToTheDOM();
      var jukebox = level.getJukebox();

      assert.equal('sound.mp3', jukebox.assets.get('gameObject').src);
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
    var fakeSoundLoader = {load: function() {}};

    var TestAssetLoaderFactoryWithLongRunningTypes = {
      create: function(type, callback) {
        fakeSoundLoader.callback = callback;
        return fakeSoundLoader;
      }
    };

    var imageLoader = {
      load: function(levelSpec, objectName, callback) {
        this.complete = callback;
      }
    }
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactoryWithLongRunningTypes,
      screen: 'screen'
    });

    gameSpec.registerLoader('image', imageLoader);
    gameSpec.load("newLevel", callback);
    assert.ok(!callback.called);

    imageLoader.complete();
    assert.ok(!callback.called);

    fakeSoundLoader.callback();
    assert.ok(callback.called);
  });
  
  it("allows access to the game objects", function() {
    var gameDescription = {
      "levelOne": {
        "gameObject" : {
          "type" : { 
            "property" : 2
          }
        }
      }
    };
     
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory, 
      screen: 'screen'
    });

    gameSpec.load("levelOne", function(level) {
      assert.equal(2, level.gameObject('gameObject').property);
    });

  });

  it("allows adding a game object at any time", function() {
    var gameDescription = {
      "levelOne" : {}
    };
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory, 
      screen: 'screen'
    });

    gameSpec.load("levelOne", function(level) {
      level.addGameObject("key", {"object_id" : 2});
      assert.equal(2, level.gameObject('key').object_id);
    });
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
      assetLoaderFactory: TestAssetLoaderFactory,
      screen: 'screen'
    });

    var imageLoader = {
      load: function(levelSpec, objectName, callback) {
        callback(objectName, objectName);
      }
    };

    gameSpec.registerLoader('image', imageLoader);
    var Pipeline = require("../src/object_pipeline/display_visible_objects");
    var displayStub = sandbox.stub(Pipeline, "displayVisibleObjects");

    gameSpec.load("newLevel", function(level) {
      var firstParam = displayStub.args[0][0]
      assert.equal('screen', firstParam);

      var levelSpec = displayStub.args[0][1];
      assert.ok(levelSpec['gameObject_1']);

      var level = displayStub.args[0][2];
      assert.equal('gameObject_1', level.gameObject('gameObject_1'));
      assert.equal('gameObject_2', level.gameObject('gameObject_2'));
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
      assetLoaderFactory: TestAssetLoaderFactory,
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
