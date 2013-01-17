describe("GameSpec", function() {
  var sandbox = require('sinon').sandbox.create(),
      GameSpec = require('../src/game_spec'),
      Assert = require('assert'),
      TestAssetLoaderFactory = require('../src/test_helpers/test_asset_loader_factory'),
      SpriteLoader = require('../src/object_pipeline/sprite_loader'),
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

  afterEach(function() {
    sandbox.restore();
  });

  it("loads no jukebox when the definition passed in is empty", function(done) {
    var gameSpec = new GameSpec({
      assetDefinition: {},
      screen: 'screen'
    });

    gameSpec.load("monkey", function(level) {
      Assert.equal(0, level.getJukebox().assets.size());
      done();
    });
  });

  it("adds image assets for any images in level", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject" : {
          "image" : {
            "src" : "background.jpg"
          }
        }
      }
    };
   
    // Just do the load without actually waiting for the 
    // on load
    var testAssetLoader = function(config) {
      var AssetLoader = require('../src/asset_loader.js');

      var TestAssetLoader = function(config) {
        var loader = AssetLoader(config);
        this.load = function() {
          var element = config.jquery("<" + config.htmlTagName + " src='" + config.object[config.tagName]['src'] + "'>");

          config.object.asset = element.get(0);
          config.onComplete(config.object, element.get(0));
        };
      };

      return new TestAssetLoader(config);
    };

    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory,
      assetLoader: testAssetLoader,
      screen: 'screen'
    });
    gameSpec.registerLoader('image', SpriteLoader);

    gameSpec.load("newLevel", function(level) {
      var imageAsset = level.gameObject('gameObject');
      Assert.equal('background.jpg', imageAsset.asset.src);
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
      Assert.equal('prop.thing', asset.prop);
    });
  });

  it("calls the asset loader correctly - see if needed");
  it("makes any registered callbacks");
  it("waits for all those assets to be done too");

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

      Assert.equal('sound.mp3', jukebox.assets.get('gameObject').src);
    });
  });

  it("doesnt fire the complete callback until all assets and sounds are finished", function() {
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

    // Just do the load without actually waiting for the 
    // on load
    var assetLoader = null;
    var testAssetLoader = function(config) {
      if (!assetLoader) {
        var TestAssetLoader = function(config) {
          var element;
          this.load = function() {
            element = config.jquery("<" + config.htmlTagName + " src='" + config.object[config.tagName]['src'] + "'>");
          };

          this.complete = function() {
            config.onComplete(config.object, element.get(config.objectName));
          };
        };
        assetLoader = new TestAssetLoader(config);
      }
      return assetLoader;
    };

    var TestAssetLoaderFactoryWithLongRunningTypes = {
      create: function(type, callback) {
        fakeSoundLoader.callback = callback;
        return fakeSoundLoader;
      }
    };
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactoryWithLongRunningTypes,
      assetLoader: testAssetLoader,
      screen: 'screen'
    });

    gameSpec.registerLoader('image', SpriteLoader);
    gameSpec.load("newLevel", callback);
    Assert.ok(!callback.called);

    assetLoader.complete();
    Assert.ok(!callback.called);

    fakeSoundLoader.callback();
    Assert.ok(callback.called);
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
      Assert.equal(2, level.gameObject('gameObject').property);
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
      Assert.equal(2, level.gameObject('key').object_id);
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

    // Just do the load without actually waiting for the 
    // on load
    var testAssetLoader = function(config) {
      var AssetLoader = require('../src/asset_loader.js');

      var TestAssetLoader = function(config) {
        var loader = AssetLoader(config);
        this.load = function() {
          var element = config.jquery("<" + config.htmlTagName + " src='" + config.object[config.tagName]['src'] + "'>");

          config.object.asset = element.get(0);
          config.onComplete(config.object, element.get(0));
        };
      };

      return new TestAssetLoader(config);
    };

    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory,
      assetLoader: testAssetLoader,
      screen: 'screen'
    });

    gameSpec.registerLoader('image', SpriteLoader);
    var Pipeline = require("../src/object_pipeline/display_visible_objects");
    var displayStub = sandbox.stub(Pipeline, "displayVisibleObjects");

    gameSpec.load("newLevel", function(level) {
      var firstParam = displayStub.args[0][0]
      Assert.equal('screen', firstParam);

      var levelSpec = displayStub.args[0][1];
      Assert.ok(levelSpec['gameObject_1']);
//      Assert.equal(gameSpec['gameObject_1'], levelSpec['gameObject_1']);

      var level = displayStub.args[0][2];
      Assert.ok(level.gameObject('gameObject_1'));
      Assert.ok(level.gameObject('gameObject_2'));
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
      Assert.ifError(gameObject.x);
    });
  });
});
